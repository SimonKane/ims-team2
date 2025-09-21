export type Contact = {
  _id: string;
  name: string;
};

export type ManuTotal = {
  manufacturer: string;
  totalStockValue: number;
};

export type Manufacturer = {
  _id: string;
  name: string;
  email: string;
  country: string;
  description: string;
  website: string;
  contact: Contact;
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
