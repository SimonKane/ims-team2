import { useState, useEffect } from "react";
import {
  type Manufacturer,
  type Product,
  type ManuTotal,
} from "../shared/types.ts";
import Card from "./components/Card.tsx";
import NavBar from "./components/NavBar.tsx";
import PaginationBox from "./components/Pagination.tsx";

//TODO eventuell flytta pagineringen till server side!
export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [query, setQuery] = useState<string>("");
  const [limit, _setLimit] = useState<string>("100");
  const [page, setPage] = useState<number>(1);
  const [choice, setChoice] = useState<string>("");
  const [totalStockManu, setTotalStockManu] = useState<ManuTotal[]>([]);

  //Dessa är för pagineringen och vilka som ska Cards som ska visas
  const start = (page - 1) * 12;
  const visibleProducts = products.slice(start, start + 12);
  const visibleManufacturers = manufacturers.slice(start, start + 12);
  const totalPages = Math.max(1, Math.ceil(products.length / 12));

  //Stor useEffect som kan struktureras om, men gör fetch beroende på vad man vill ha samt hämtar total stock by manufacturer
  useEffect(() => {
    if (!choice) return;
    const fetchTotalByManufacturer = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/products/total-stock-value-by-manufacturer"
        );
        const data = await res.json();

        setTotalStockManu(data);
      } catch (error) {
        console.error("Error getting total products by manufacturers");
      }
    };

    const fetchItems = async () => {
      if (choice === "products") {
        try {
          const params = new URLSearchParams({ limit });
          if (query) params.append("search", query);
          const url = `http://localhost:3000/api/products?${params.toString()}`;
          const res = await fetch(url);
          const data = await res.json();
          setProducts(data);
          setPage(1);
        } catch (error) {
          setProducts([]);
          console.error("Error trying to fetch products");
          setPage(1);
        }
      }
      if (choice === "manufacturers") {
        try {
          fetchTotalByManufacturer();
          const params = new URLSearchParams();
          const url = `http://localhost:3000/api/manufacturers?${params.toString()}`;
          const res = await fetch(url);
          const data = await res.json();
          setManufacturers(data);
        } catch (error) {
          console.error("Error trying to fetch manufacturers");
          setManufacturers([]);
        }
      }
    };
    fetchItems();
  }, [query, limit, choice]);

  return (
    <>
      <NavBar
        choice={choice}
        products={products}
        query={query}
        onSearch={setQuery}
      />
      <div className="w-[80vw] h-[80vh] bg-[#A49E8D] rounded-b-xl shadow-lg p-6 flex flex-col ">
        {!choice && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6">
            <h1 className="text-2xl font-bold text-white">
              What do you want to display?
            </h1>
            <div className="flex gap-6">
              {" "}
              <button
                className="px-6 py-3 rounded-xl bg-white/90 text-[#504136] font-semibold shadow-md hover:bg-white transition cursor-pointer"
                onClick={() => setChoice("manufacturers")}
              >
                Manufacturers
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-white/90 text-[#504136] font-semibold shadow-md hover:bg-white transition cursor-pointer"
                onClick={() => setChoice("products")}
              >
                All Products
              </button>
            </div>
          </div>
        )}
        {choice && (
          <>
            <div className="grid grid-cols-3 gap-4 flex-1 overflow-auto content-start min-w-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ">
              {choice === "products"
                ? visibleProducts.map((product, i) => (
                    <Card
                      key={product._id}
                      amount={product.amountInStock}
                      title={product.name}
                      delay={i * 0.02}
                      manufacturer={product.manufacturer.name}
                      choice={choice}
                    />
                  ))
                : visibleManufacturers.map((manufacturer, i) => {
                    const total =
                      totalStockManu.find(
                        (m) => m.manufacturer === manufacturer.name
                      )?.totalStockValue ?? 0;

                    return (
                      <Card
                        key={manufacturer._id}
                        title={manufacturer.name}
                        delay={i * 0.02}
                        choice={choice}
                        total={total}
                      />
                    );
                  })}
            </div>
            <div className="mt-4 self-center">
              <PaginationBox
                page={page}
                onPageChange={setPage}
                totalPages={totalPages}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
