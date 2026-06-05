import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { chatbotKnowledge } from '@/lib/chatbot-knowledge';
import { createServiceClient } from '@/lib/supabase/service';
import { env } from '@/env';


/**
 * Generate query vector embedding using Gemini text-embedding-004
 */
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: {
                parts: [{ text }],
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Gemini embedding request failed: ${response.statusText}`);
    }

    const data = await response.json() as any;
    if (!data.embedding || !data.embedding.values) {
        throw new Error('Invalid embedding response format');
    }
    return data.embedding.values;
}

export async function POST(req: Request) {
    try {
        const apiKey = env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ 
                error: 'Configuration Error', 
                details: 'GOOGLE_GENERATIVE_AI_API_KEY is missing. Please add it to your environment variables.' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { messages } = await req.json();
        
        // Find the last user message to generate retrieval embedding
        const lastUserMessage = [...messages]
            .reverse()
            .find((m: any) => m.role === 'user');

        let contextText = '';

        if (lastUserMessage && lastUserMessage.content) {
            try {
                // Initialize Supabase service client and cast to access unregistered match_documents function
                const supabaseAdmin = createServiceClient() as unknown as {
                    rpc: (
                        fn: string,
                        args?: Record<string, unknown>
                    ) => Promise<{
                        data: { content: string; metadata?: { source?: string } }[] | null;
                        error: { message: string } | null;
                    }>;
                };
                
                // 1. Generate query embedding vector
                const queryVector = await generateEmbedding(lastUserMessage.content, apiKey);

                // 2. Execute Cosine Similarity search via pgvector match_documents function
                const { data: matchedChunks, error: rpcError } = await supabaseAdmin.rpc(
                    'match_documents',
                    {
                        query_embedding: queryVector as unknown as Record<string, unknown>,
                        match_threshold: 0.35 as unknown as Record<string, unknown>,
                        match_count: 4 as unknown as Record<string, unknown>,
                    }
                );

                if (rpcError) {
                    console.error('Supabase RAG Vector search error:', rpcError.message);
                } else if (matchedChunks && matchedChunks.length > 0) {
                    contextText = matchedChunks
                        .map((chunk: any) => `[Verified Fact Source: ${chunk.metadata?.source || 'Gifting Docs'}]\n${chunk.content}`)
                        .join('\n\n');
                }
            } catch (ragError: any) {
                // Graceful fallback to standard AI completions if pgvector is not seeded
                console.warn('RAG processing degraded to standard completion:', ragError.message || ragError);
            }
        }

        // 3. Construct System Prompt with Context
        const systemPrompt = `
${chatbotKnowledge}

### Verified Gifting Factsheets:
Use the following verified facts to answer the user query accurately. Rely on these details as the ultimate source of truth:

${contextText || 'No specific verified facts retrieved for this query. Answer using the base platform rules.'}
`;

        // 4. Stream response
        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to process message', 
            details: String(error) 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
