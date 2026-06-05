-- Enable the vector extension to work with embeddings
create extension if not exists vector;

-- Create the table to store knowledge chunks and their embeddings
create table if not exists public.knowledge_documents (
    id bigint generated always as identity primary key,
    content text not null,
    metadata jsonb,
    embedding vector(768) -- text-embedding-004 produces 768 dimensions
);

-- Enable Row Level Security (RLS)
alter table public.knowledge_documents enable row level security;

-- Allow read-only access to authenticated and anonymous users
create policy "Allow public read access to knowledge_documents"
    on public.knowledge_documents
    for select
    to anon, authenticated
    using (true);

-- Allow full access to service_role (for background ingestion scripts)
create policy "Allow service_role full access to knowledge_documents"
    on public.knowledge_documents
    for all
    to service_role
    using (true);

-- Create an HNSW index for fast similarity search using Cosine Distance
create index if not exists knowledge_documents_hnsw_idx 
    on public.knowledge_documents 
    using hnsw (embedding vector_cosine_ops);

-- Create a helper function to perform cosine similarity vector search
create or replace function match_documents (
    query_embedding vector(768),
    match_threshold float,
    match_count int
)
returns table (
    id bigint,
    content text,
    metadata jsonb,
    similarity float
)
language sql stable
as $$
    select
        id,
        content,
        metadata,
        1 - (knowledge_documents.embedding <=> query_embedding) as similarity
    from knowledge_documents
    where 1 - (knowledge_documents.embedding <=> query_embedding) > match_threshold
    order by knowledge_documents.embedding <=> query_embedding
    limit match_count;
$$;
