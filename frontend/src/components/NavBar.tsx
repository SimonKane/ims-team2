import { BsSearch } from "react-icons/bs";
import { useState } from "react";

//TODO make navbar with filter, search and low stock notice

type NavBarProps = {
  onSearch: (query: string) => void;
};

const NavBar = ({ onSearch }: NavBarProps) => {
  const [query, setQuery] = useState<string>("");

  //Make function to handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(query);
    onSearch(query);
    setQuery("");
  };

  return (
    <div className="w-[80vw] h-[10vh] bg-amber-600 rounded-t-xl mb-3 shadow-lg flex items-center justify-end px-6">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-md px-3 py-1 shadow-sm w-72"
      >
        <input
          value={query}
          type="text"
          placeholder="Search..."
          className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button type="submit">
          <BsSearch className="text-gray-500 ml-2 cursor-pointer" size={20} />
        </button>
      </form>
    </div>
  );
};

export default NavBar;

//TODO check all items from critical products and show on notice click
