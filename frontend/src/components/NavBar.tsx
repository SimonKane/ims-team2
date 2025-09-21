import {
  BsSearch,
  BsFilter,
  BsExclamationTriangle,
  BsSortUp,
} from "react-icons/bs";
import { useState } from "react";
import type { Product } from "../../shared/types.ts";
import type { Manufacturer } from "../../shared/types.ts";
import AutoCompleteSearchBox from "./AutoComplete.tsx";

//TODO make navbar with filter, search and low stock notice

type NavBarProps = {
  onSearch: (query: string) => void;
  query: string;
  products: Product[] | Manufacturer[];
  choice?: string;
};

const NavBar = ({ onSearch, products, query, choice }: NavBarProps) => {
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");

  return (
    <div className="w-[80vw] h-[10vh] bg-[#504136] rounded-t-xl mb-3 shadow-lg flex items-center justify-end px-6">
      <div className=" relative item-container flex items-center gap-2 mr-4">
        <button
          title={"Filter"}
          type="button"
          aria-label="Filter"
          className="p-2 rounded-md bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
        >
          <BsFilter size={18} />
        </button>

        <button
          onClick={() => {
            setSortOpen(!sortOpen);
          }}
          title={"Sort"}
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-md bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
        >
          <BsSortUp size={18} />
        </button>
        {/* {sortOpen && (
          <div className="absolute left-19 top-8 mt-2 bg-white text-black text-sm rounded shadow p-1 z-10">
            <p className="block w-full text-left px-3 py-1">Sort by: </p>
            <button
              className="block w-full text-left px-3 py-1 hover:bg-gray-100"
              onClick={() => {
                onSortChange("name", "asc");
                setSortOpen(false);
              }}
            >
              Name
            </button>
            <button
              className="block w-full text-left px-3 py-1 hover:bg-gray-100"
              onClick={() => {
                onSortChange("manufacturer", "asc");
                setSortOpen(false);
              }}
            >
              Manufacturer
            </button>
            <button
              className="block w-full text-left px-3 py-1 hover:bg-gray-100"
              onClick={() => {
                onSortChange("amountInStock", "asc");
                setSortOpen(false);
              }}
            >
              Amount in stock
            </button>
          </div>
        )} */}

        <button
          title={"Critical Low Stock"}
          type="button"
          aria-label="Alerts"
          className="relative p-2 rounded-md bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
        >
          <BsExclamationTriangle size={18} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(searchText);
        }}
        className={`flex items-center ${
          !choice ? "bg-gray-300" : "bg-white"
        } rounded-md px-3 py-1 shadow-sm w-72`}
      >
        <AutoCompleteSearchBox
          choice={choice}
          value={searchText}
          products={products}
          onSearch={setSearchText}
        />

        <button onClick={() => onSearch(query)} type="submit">
          <BsSearch className="text-gray-500 ml-2 cursor-pointer" size={20} />
        </button>
      </form>
    </div>
  );
};

export default NavBar;

//TODO check all items from critical products and show on notice click
