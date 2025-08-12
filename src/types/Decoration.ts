export type Vendor = {
  name: string;
  address: string;
  phone: string;
  email: string;
  timeline: string;
  rating: number;
  specializations: string[];
};

export type Decoration = {
  name: string;
  type: string;
  colorPalette: string[];
  style: string;
  size: string;
  placement: string;
  fileFormat: string;
  vendor: Vendor;
};
