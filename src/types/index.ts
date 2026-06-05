export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  occasion?: string[];
  description: string;
  shortDescription: string;
  variants?: Variant[];
  customizable: boolean;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isBestseller?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface Variant {
  id: string;
  name: string;
  value: string;
  priceModifier?: number;
  inStock: boolean;
}

export interface CartItem {
  id: string; // Unique identifier for this cart item (e.g. product_id + variants_hash)
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
  customData?: {
    type: "byob";
    box: any;
    items: any[];
    message?: string;
    card?: string;
  };
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  icon?: string;
}

export interface CorporatePackage {
  id: string;
  name: string;
  description: string;
  minQuantity: number;
  pricePerUnit: number;
  features: string[];
  image: string;
  popular?: boolean;
}
