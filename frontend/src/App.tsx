import { useState, useEffect } from "react";
import type { Product } from "../shared/types.ts";
import Card from "./components/Card.tsx";

// interface Product {
//   _id: string;
//   amountInStock: number;
//   category: string;
//   createdAt: string;
//   description: string;
//   manufacturer: string;
//   name: string;
//   price: number;
//   sku: string;
//   updatedAt: string;
//   __v?: number;
// }

export default function App() {
  const [test, setTest] = useState<Product[]>([]);

  async function getProducts() {
    await fetch("http://localhost:3000/api/products?limit=10")
      .then((res) => res.json())
      .then((data) => setTest(data));
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="w-[80vw] h-[80vh] bg-white rounded-xl shadow-lg p-6 grid grid-cols-3 overflow-auto gap-4">
      {test.map((product) => {
        return <Card amount={product.amountInStock} title={product.name} />;
      })}
    </div>
  );
}
