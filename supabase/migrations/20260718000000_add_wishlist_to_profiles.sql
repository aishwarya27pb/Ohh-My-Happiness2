-- Add wishlist_data column to profiles table to enable database-backed wishlist storage
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wishlist_data JSONB DEFAULT '[]'::jsonb;
