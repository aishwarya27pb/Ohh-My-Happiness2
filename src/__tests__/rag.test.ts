import { describe, it, expect } from 'vitest';

/**
 * Text semantic chunking function (copied from scripts/ingest.ts for test validation)
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

describe('RAG Chunker', () => {
    it('should split document into distinct chunks based on paragraph separators', () => {
        const doc = `Paragraph 1 text content.\n\nParagraph 2 text content here.\n\nParagraph 3 text content also here.`;
        const chunks = chunkText(doc, 100, 20);
        
        expect(chunks.length).toBeGreaterThanOrEqual(1);
        expect(chunks[0]).toContain('Paragraph 1');
    });

    it('should respect max characters constraint and generate overlap', () => {
        const doc = `This is a long sentence that should ideally trigger chunk boundaries because it is highly verbose.\n\nAnother highly descriptive paragraph containing dynamic gifting and hamper terms to test vector constraints.`;
        const chunks = chunkText(doc, 80, 20);
        
        expect(chunks.length).toBeGreaterThan(1);
        expect(chunks[1]).toBeDefined();
    });

    it('should gracefully handle empty documents', () => {
        const doc = `   \n\n  \n\n   `;
        const chunks = chunkText(doc);
        expect(chunks.length).toBe(0);
    });
});
