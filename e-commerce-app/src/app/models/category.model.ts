export interface Category {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description?: string;
  readonly imageUrl: string;
  readonly productCount?: number;
}
