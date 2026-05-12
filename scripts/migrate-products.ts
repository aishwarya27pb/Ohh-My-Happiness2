import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { categories, products } from '../src/data/products.backup.js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  console.log('🚀 Starting migration...');

  // 1. Insert Categories
  console.log('\n📦 Migrating categories...');
  const categoryMap = new Map();

  for (const cat of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        product_count: cat.productCount,
        icon: cat.icon
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error inserting category ${cat.slug}:`, error.message);
    } else {
      console.log(`✅ Category migrated: ${cat.name}`);
      categoryMap.set(cat.slug, data.id);
    }
  }

  // 2. Insert Products
  console.log('\n🎁 Migrating products...');
  for (const prod of products) {
    const categoryId = categoryMap.get(prod.category);
    
    const { error } = await supabase
      .from('products')
      .upsert({
        name: prod.name,
        slug: prod.slug,
        price: prod.price,
        original_price: prod.originalPrice,
        images: prod.images,
        category_id: categoryId,
        category_slug: prod.category,
        occasion: prod.occasion,
        description: prod.description,
        short_description: prod.shortDescription,
        variants: prod.variants || [],
        customizable: prod.customizable,
        in_stock: prod.inStock,
        rating: prod.rating,
        review_count: prod.reviewCount,
        tags: prod.tags,
        is_bestseller: prod.isBestseller || false,
        is_featured: prod.isFeatured || false,
        is_new: prod.isNew || false
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error inserting product ${prod.slug}:`, error.message);
    } else {
      console.log(`✅ Product migrated: ${prod.name}`);
    }
  }

  console.log('\n✨ Migration complete!');
}

migrate();
