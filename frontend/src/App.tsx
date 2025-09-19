import { useState, useEffect } from "react";
import type { Product } from "../shared/types.ts";
import Card from "./components/Card.tsx";
import NavBar from "./components/NavBar.tsx";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [limit, setLimit] = useState<string>("10");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({ limit: limit });
        if (query) params.append("search", query);
        const url = ` http://localhost:3000/api/products?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error trying to fetch products");
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <>
      <NavBar onSearch={setQuery} />
      <div className="w-[80vw] h-[80vh]  bg-white rounded-b-xl shadow-lg p-6 grid grid-cols-3 overflow-auto gap-4">
        {products.map((product) => {
          return <Card amount={product.amountInStock} title={product.name} />;
        })}
      </div>
    </>
  );
}
