import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
    console.error('Error: Missing required environment variables in .env.local.');
    console.error('Make sure the following are defined:');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- SUPABASE_SERVICE_ROLE_KEY');
    console.error('- GOOGLE_GENERATIVE_AI_API_KEY');
    process.exit(1);
}

// Initialize Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Generate a 768-dimension vector embedding using Gemini
 */
async function generateEmbedding(text: string): Promise<number[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiApiKey}`;
    
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
        const errText = await response.text();
        throw new Error(`Gemini embedding failed: ${response.status} - ${errText}`);
    }

    const data = await response.json() as any;
    if (!data.embedding || !data.embedding.values) {
        throw new Error('Unexpected response format from Gemini embedding API');
    }

    return data.embedding.values;
}

/**
 * Split text into semantic chunks based on paragraph separators
 */
function chunkText(text: string, maxChars = 600, overlap = 100): string[] {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const para of paragraphs) {
        const cleanPara = para.trim();
        if (!cleanPara) continue;

        if (currentChunk.length + cleanPara.length > maxChars) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }
            // Start new chunk with word overlap
            const words = currentChunk.split(/\s+/);
            const overlapWords = words.slice(-15).join(' ');
            currentChunk = overlapWords + '\n\n' + cleanPara;
        } else {
            currentChunk = currentChunk ? currentChunk + '\n\n' + cleanPara : cleanPara;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

async function ingestFile(filePath: string) {
    console.log(`Processing file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    
    const chunks = chunkText(content);
    console.log(`Split into ${chunks.length} chunks. Generating embeddings...`);

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        try {
            const embedding = await generateEmbedding(chunk);
            
            // Insert chunk & vector into Supabase knowledge base
            const { error } = await supabase
                .from('knowledge_documents')
                .insert({
                    content: chunk,
                    metadata: {
                        source: filename,
                        chunk_index: i,
                    },
                    embedding,
                });

            if (error) {
                console.error(`Error inserting chunk ${i} to Supabase:`, error.message);
            } else {
                console.log(`Successfully ingested chunk ${i + 1}/${chunks.length}`);
            }
        } catch (err: any) {
            console.error(`Failed to process chunk ${i}:`, err.message || err);
        }
    }
}

async function main() {
    const knowledgeDir = path.join(process.cwd(), 'data', 'knowledge');
    
    if (!fs.existsSync(knowledgeDir)) {
        console.error(`Knowledge directory does not exist: ${knowledgeDir}`);
        process.exit(1);
    }

    const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    if (files.length === 0) {
        console.log('No markdown or text documents found in data/knowledge/');
        return;
    }

    console.log(`Found ${files.length} files to ingest.`);
    for (const file of files) {
        await ingestFile(path.join(knowledgeDir, file));
    }
    console.log('🎉 Gifting Knowledge ingestion complete!');
}

main().catch(err => {
    console.error('Ingestion script execution error:', err);
    process.exit(1);
});
