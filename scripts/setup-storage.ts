import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupBucket() {
  console.log('Checking for product-images bucket...')
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.error('Error listing buckets:', listError.message)
    return
  }

  const bucketExists = buckets.find(b => b.name === 'product-images')

  if (!bucketExists) {
    console.log('Creating product-images bucket...')
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (error) {
      console.error('Error creating bucket:', error.message)
    } else {
      console.log('Bucket created successfully!')
    }
  } else {
    console.log('Bucket already exists.')
    if (!bucketExists.public) {
      console.log('Updating bucket to public...')
      const { error } = await supabase.storage.updateBucket('product-images', { public: true })
      if (error) console.error('Error updating bucket:', error.message)
      else console.log('Bucket updated to public.')
    }
  }
}

setupBucket()
