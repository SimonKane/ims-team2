export type Contact = {
  _id: string;
  name: string;
  phone: string;
  email: string;
};

export type ManuTotal = {
  manufacturer: string;
  totalStockValue: number;
};
export type Manufacturer = {
  _id: string;
  name: string;

  country: string;
  description: string;
  website: string;
  address: string;
  contact: Contact;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Product = {
  _id: string;
  amountInStock: number;
  category: string;
  createdAt: string;
  description: string;
  manufacturer: Manufacturer;
  name: string;
  price: number;
  sku: string;
  updatedAt: string;
  __v?: number;
};
