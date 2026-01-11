export interface IProduct {
  id: string;
  model: string;
  power: string;
  gearbox: string;
  price: number;
  newPrice?: number;
  range: string;
  autonomy?: string;
  image: string;
  quantity: number;
  isActive: boolean;
  createdAt: Date;
}

export interface IProductCreate {
  model: string;
  power: string;
  gearbox: string;
  price: number;
  newPrice?: number;
  range: string;
  autonomy?: string;
  image: string;
  quantity: number;
}

export interface IProductUpdate {
  model?: string;
  power?: string;
  gearbox?: string;
  price?: number;
  newPrice?: number;
  range?: string;
  autonomy?: string;
  image?: string;
  quantity?: number;
}
