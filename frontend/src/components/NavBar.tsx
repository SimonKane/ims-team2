import { useEffect } from "react";
import ManufacturerCard from "./ManufacturerCard.tsx";

import {
  BsSearch,
  BsFilter,
  BsExclamationTriangle,
  BsSortUp,
  BsPlusSquare,
  BsArrowLeftSquare,
} from "react-icons/bs";
import { useState } from "react";
import type { Product } from "../../shared/types.ts";
import type { Manufacturer } from "../../shared/types.ts";
import AutoCompleteSearchBox from "./AutoComplete.tsx";
import AddProduct from "./AddProduct.tsx";

//TODO low notice alert

type NavBarProps = {
  onSearch: (query: string) => void;
  query: string;
  products: Product[] | Manufacturer[];
  choice?: string;
  categories?: string[];
  category?: string;
  sortBy?: string;
  onCategoryChange?: (val: string) => void;
  onSortChange?: (val: string) => void;
};

const NavBar = ({
  onSearch,
  products,
  choice,
  query = "",
  sortBy = "",
  categories = [],
  category = "",
  onCategoryChange,
  onSortChange,
}: NavBarProps) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [criticalProducts, setCriticalProducts] = useState<Product[] | []>([]);
  const [criticalOpen, setCriticalOpen] = useState(false);
  const [manufacturerModal, setManufacturerModal] = useState<boolean>(false);
  const [manufacturerID, setManufacturerId] = useState<string>("");
  const [manuFacturerName, setManufacturerName] = useState<string>("");

  async function getProductsCriticalStock() {
    try {
      const res = await fetch(
        "http://localhost:3000/api/products/critical-stock"
      );
      const data = await res.json();
      setCriticalProducts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    try {
      getProductsCriticalStock();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    setSearchText(query);
  }, [query]);

  const handleModalClick = (e: any) => {
    if (e.target.id === "modal") setManufacturerModal(false);
  };

  return (
    <>
      {addModal && <AddProduct onClose={() => setAddModal(false)} />}
      {manufacturerModal && (
        <div
          onClick={handleModalClick}
          id="modal"
          className="z-10 absolute h-[100%] w-[100%] top-0 left-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center"
        >
          <ManufacturerCard
            id={manufacturerID}
            getName={() => manuFacturerName}
            closeModal={() => {
              setManufacturerModal(false);
            }}
          />
        </div>
      )}
      <div
        className="relative w-[80vw] h-[10vh] bg-[#504136] rounded-t-xl mb-3 shadow-lg flex items-center justify-end px-6"
        onClick={() => {
          setFilterOpen(false);
          setSortOpen(false);
          setCriticalOpen(false);
        }}
      >
        {choice && (
          <button
            onClick={() => {
              setAddModal(false);
              setSortOpen(false);
              setFilterOpen(false);
              setCriticalOpen(false);
              window.location.reload();
            }}
            title="Go Back"
            type="button"
            aria-label="Go Back"
            className="absolute left-10 p-2 rounded-md bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
          >
            <BsArrowLeftSquare size={18} />
          </button>
        )}

        <div
          className="relative item-container flex items-center gap-2 mr-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setAddModal(true);
              setSortOpen(false);
              setFilterOpen(false);
              setCriticalOpen(false);
            }}
            title="Add Product"
            type="button"
            aria-label="Add Product"
            className="relative p-2 rounded-md bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
          >
            <BsPlusSquare size={18} />
          </button>

          <div className="relative">
            <button
              title="Filter"
              type="button"
              aria-label="Filter"
              onClick={() => {
                setFilterOpen((v) => !v);
                setSortOpen(false);
                setCriticalOpen(false);
              }}
              className="p-2 rounded-md bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
            >
              <BsFilter size={18} />
            </button>

            {filterOpen && choice === "products" && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-black text-sm rounded shadow p-2 z-20">
                <label className="block text-xs font-semibold mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    onCategoryChange?.(e.target.value);
                    setFilterOpen(false);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setSortOpen((v) => !v);
                setFilterOpen(false);
                setCriticalOpen(false);
              }}
              title="Sort"
              type="button"
              aria-label="Sort"
              className="relative p-2 rounded-md bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
            >
              <BsSortUp size={18} />
            </button>

            {sortOpen && choice === "products" && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-black text-sm rounded shadow p-2 z-20">
                <p className="block w-full text-left px-3 py-1 font-semibold">
                  Sort by
                </p>
                <button
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    onSortChange?.("price-low");
                    setSortOpen(false);
                  }}
                >
                  Price: Low → High
                </button>
                <button
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    onSortChange?.("price-high");
                    setSortOpen(false);
                  }}
                >
                  Price: High → Low
                </button>
                <button
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    onSortChange?.("stock-low");
                    setSortOpen(false);
                  }}
                >
                  Stock: Low → High
                </button>
                <button
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    onSortChange?.("stock-high");
                    setSortOpen(false);
                  }}
                >
                  Stock: High → Low
                </button>
              </div>
            )}
          </div>
          {criticalProducts.length !== 0 && (
            <div className="relative">
              <button
                title="Critical Low Stock"
                type="button"
                aria-label="Alerts"
                className="relative p-2 rounded-md bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterOpen(false);
                  setSortOpen(false);
                  setCriticalOpen((v) => !v);
                }}
              >
                <BsExclamationTriangle color="red" size={18} />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {criticalOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 max-h-72 overflow-auto bg-white text-black text-sm rounded-lg shadow-xl ring-1 ring-black/5 p-3 z-30"
                  aria-label="Critical low stock"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <BsExclamationTriangle
                      className="text-red-500 mt-0.5"
                      size={16}
                    />
                    <p className="font-semibold leading-tight">
                      Critical low stock, contact manufacturer:
                    </p>
                  </div>

                  <ul className="divide-y divide-gray-200" role="list">
                    {criticalProducts.map((p: Product) => {
                      return (
                        <li
                          key={
                            p._id ??
                            p.sku ??
                            `${p.name}-${p?.manufacturer?._id ?? ""}`
                          }
                          className="py-1"
                        >
                          <button
                            type="button"
                            className="group w-full px-2 py-2 rounded text-left flex items-center gap-2 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#504136]/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              setManufacturerId(p?.manufacturer?._id);
                              setManufacturerName(p?.manufacturer?.name);
                              setManufacturerModal(true);
                              setCriticalOpen(false);
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <div
                                className="truncate font-medium group-hover:text-[#504136]"
                                title={p.name}
                              >
                                {p.name}
                              </div>
                              <div
                                className="text-xs text-gray-500 truncate"
                                title={p?.manufacturer?.name}
                              >
                                {p?.manufacturer?.name ?? "—"}
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[11px]">
                              {p?.amountInStock ?? 0}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(searchText);
          }}
          className={`flex items-center ${
            !choice ? "bg-gray-300" : "bg-white"
          } rounded-md px-3 py-1 shadow-sm w-72`}
          onClick={(e) => e.stopPropagation()}
        >
          <AutoCompleteSearchBox
            onChangeValue={setSearchText}
            choice={choice}
            value={searchText}
            products={products}
            onSubmit={() => onSearch(searchText)}
          />
          <button type="submit">
            <BsSearch className="text-gray-500 ml-2 cursor-pointer" size={20} />
          </button>
        </form>
      </div>
    </>
  );
};
export default NavBar;
