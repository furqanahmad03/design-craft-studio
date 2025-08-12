export type Vendor = {
  name: string;
  address: string;
  phone: string;
  email: string;
  timeline: string;
  rating: number;
  specializations: string[];
};

export type Order = {
  id: string;
  productName?: string;
  productType?: string;
  quantity?: number;
  basePrice?: number;
  totalPrice?: number;
  designType: 'premade' | 'custom';
  selectedDesign?: string;
  customDesignFile?: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  vendor: Vendor;
  notes?: string;
}; 