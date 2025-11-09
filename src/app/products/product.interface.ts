export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryId: string;
  sku: string;
  images: string[];
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
