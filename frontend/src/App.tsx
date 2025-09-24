import { useState, useEffect } from "react";
import {
  type Manufacturer,
  type Product,
  type ManuTotal,
} from "../shared/types.ts";
import Card from "./components/Card.tsx";
import NavBar from "./components/NavBar.tsx";
import ManufacturerCard from "./components/ManufacturerCard.tsx";
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [manufacturerID, setManufacturerId] = useState<string>("");
  const [manuFacturerName, setManufacturerName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const filteredProducts = products
    .filter((p) => (category ? p.category === category : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price ?? 0) - (b.price ?? 0);
        case "price-high":
          return (b.price ?? 0) - (a.price ?? 0);
        case "stock-low":
          return (a.amountInStock ?? 0) - (b.amountInStock ?? 0);
        case "stock-high":
          return (b.amountInStock ?? 0) - (a.amountInStock ?? 0);
        default:
          return 0;
      }
    });
  //Dessa är för pagineringen och vilka som ska Cards som ska visas
  const start = (page - 1) * 12;
  const visibleProducts =
    choice === "products"
      ? filteredProducts.slice(start, start + 12)
      : products.slice(start, start + 12); // fallback
  const visibleManufacturers = manufacturers.slice(start, start + 12);
  const totalPages = Math.max(
    1,
    Math.ceil(
      (choice === "products" ? filteredProducts.length : manufacturers.length) /
        12
    )
  );

  const getManufacturerProducts = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/manufacturers/products/${manufacturerID}`
      );
      const data = await res.json();
      setProducts(data.products);
      setChoice("products");
    } catch (error) {}
  };

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
          const url = manufacturerID
            ? `http://localhost:3000/api/manufacturers/products/${manufacturerID}?${params.toString()}`
            : `http://localhost:3000/api/products?${params.toString()}`;
          const res = await fetch(url);
          const data = await res.json();
          setProducts(manufacturerID ? data.products : data);
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
          if (query) params.append("search", query);
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
  }, [query, limit, choice, manufacturerID]);

  const handleModalClick = (e: any) => {
    if (e.target.id === "modal") setShowModal(false);
  };

  return (
    <>
      {showModal ? (
        <div
          onClick={handleModalClick}
          id="modal"
          className="z-10 absolute h-[100%] w-[100%] top-0 left-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center"
        >
          <ManufacturerCard
            getName={setManufacturerName}
            closeModal={() => {
              setShowModal(!showModal);
              getManufacturerProducts();
            }}
            id={manufacturerID}
          />
        </div>
      ) : (
        ""
      )}
      <NavBar
        choice={choice}
        products={choice === "products" ? products : manufacturers}
        query={query}
        onSearch={setQuery}
        categories={categories}
        category={category}
        sortBy={sortBy}
        onCategoryChange={(c: any) => {
          setCategory(c);
          setPage(1);
        }}
        onSortChange={(s: any) => {
          setSortBy(s);
          setPage(1);
        }}
      />
      <div className="w-[80vw] h-[80vh] bg-[#A49E8D] rounded-b-xl shadow-lg p-6 flex flex-col  ">
        {!choice && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6">
            <h1 className="text-2xl font-bold text-white">
              What do you want to display?
            </h1>
            <div className="flex gap-6">
              <button
                className="rounded-xl bg-[#504136] px-4 py-2 text-sm font-medium text-white shadow hover:brightness-110 transition cursor-pointer"
                onClick={() => setChoice("manufacturers")}
              >
                Manufacturers
              </button>
              <button
                className="rounded-xl bg-[#504136] px-4 py-2 text-sm font-medium text-white shadow hover:brightness-110 transition cursor-pointer"
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
                      price={product.price}
                      manufacturer={
                        product.manufacturer.name || manuFacturerName
                      }
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
                        setShowModal={() => {
                          setShowModal(!showModal);
                          setManufacturerId(manufacturer._id);
                        }}
                        key={manufacturer._id}
                        id={manufacturer._id}
                        title={manufacturer.name}
                        delay={i * 0.02}
                        choice={choice}
                        total={total}
                        amount={total}
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
