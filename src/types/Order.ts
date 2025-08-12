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
  // Product information (for product orders)
  productName?: string;
  productType?: string;
  quantity?: number;
  basePrice?: number;
  totalPrice?: number;
  
  // Design information
  designType: 'premade' | 'custom';
  selectedDesign?: string;
  customDesignFile?: string; // Path to uploaded image
  
  // Customer information
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  
  // Vendor information - can be product vendor OR decoration vendor
  vendor?: Vendor;
  
  // Custom design flag and image path
  isCustomDesign?: boolean;
  customImagePath?: string;
  
  notes?: string;
}; 