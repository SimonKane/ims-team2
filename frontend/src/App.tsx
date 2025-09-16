import { useState, useEffect } from "react";

interface Product {
  _id: string;
  amountInStock: number;
  category: string;
  createdAt: string;
  description: string;
  manufacturer: string;
  name: string;
  price: number;
  sku: string;
  updatedAt: string;
  __v?: number;
}

export default function App() {
  const [test, setTest] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setTest(data));
  }, []);

  return (
    <div>
      {test.map((product) => {
        return <h1>{product.name}</h1>;
      })}
    </div>
  );
}
