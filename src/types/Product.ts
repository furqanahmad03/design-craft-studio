export type Vendor = {
  name: string;
  address: string;
  phone: string;
  email: string;
  timeline: string;
  rating: number;
  specializations: string[];
};

export type Product = {
  name: string;
  type: string;
  quantity: number;
  basePrice: number;
  bulkPrice: number;
  bulkThreshold: number;
  color: string[];
  brand: string;
  material: string;
  vendor: Vendor;
};
