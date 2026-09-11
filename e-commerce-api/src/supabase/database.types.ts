/**
 * Hand-written to match supabase/migrations/0001_categories_and_products.sql.
 * Once the migration has been applied to the live project, regenerate with:
 *   supabase gen types typescript --project-id <project-ref> > src/supabase/database.types.ts
 * and reconcile any drift.
 */
import { ProductImage } from '../modules/products/interfaces/product.interface';

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          price_amount: number;
          price_currency: string;
          compare_at_price_amount: number | null;
          category_id: string;
          images: ProductImage[];
          rating_average: number | null;
          rating_count: number | null;
          in_stock: boolean;
          quantity: number | null;
          tags: string[] | null;
          is_featured: boolean;
          is_new: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          price_amount: number;
          price_currency?: string;
          compare_at_price_amount?: number | null;
          category_id: string;
          images?: ProductImage[];
          rating_average?: number | null;
          rating_count?: number | null;
          in_stock?: boolean;
          quantity?: number | null;
          tags?: string[] | null;
          is_featured?: boolean;
          is_new?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
