import { useEffect, useState } from "react";
import Card from "./components/Card";
import type { Product } from "../shared/types";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch("http://localhost:3000/api/products?limit=50");
      const data = await res.json();
      setProducts(data);
    };
    getProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "" || product.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "stock-low":
          return a.amountInStock - b.amountInStock;
        case "stock-high":
          return b.amountInStock - a.amountInStock;
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="stock-low">Stock: Low to High</option>
          <option value="stock-high">Stock: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <Card
            key={product._id}
            _id={product.name}
            amountInStock={product.amountInStock}
            price={product.price}
            category={product.category}
            createdAt={product.createdAt}
            // description={product.description} Activera när man fixat manufacturer.
            name={product.name}
            sku={product.sku}
            updatedAt={product.updatedAt}
            __v={product.__v}
          />
        ))}
      </div>
    </div>
  );
}
