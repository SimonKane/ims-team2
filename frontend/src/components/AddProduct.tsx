import { useState, useEffect } from "react";
import type { Manufacturer } from "../../shared/types";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";

interface ProductInput {
  name: string;
  sku: string;
  description: string;
  price: number;
  category: string;
  amountInStock: number;
}

interface AddProductProps {
  onClose?: () => void;
}

const initialProductState = {
  name: "",
  sku: "",
  description: "",
  price: 0,
  category: "",
  amountInStock: 0,
};

const AddProduct = ({ onClose }: AddProductProps) => {
  const [manufacturers, setManufacturer] = useState<Manufacturer[]>([]);
  const [productInput, setProductInput] = useState<ProductInput>({
    name: "",
    sku: "",
    description: "",
    price: 0,
    category: "",
    amountInStock: 0,
  });
  const [manufacturerId, setManufacturerId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [productCreated, setProductCreated] = useState<boolean>(false);

  async function getAllManufacturers() {
    const res = await fetch("http://localhost:3000/api/manufacturers/");
    const data = await res.json();

    setManufacturer(data);
  }

  useEffect(() => {
    try {
      getAllManufacturers();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div
      id="modal"
      className="z-10 absolute h-[100%] w-[100%] top-0 left-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center"
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const payload = { productInput, manufacturerId };
          console.log(payload)

          await fetch("http://localhost:3000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).then((res) => {
            console.log(res);
            setMessage(
              res.statusText === "Conflict"
                ? "Product (SKU) already exists"
                : ""
            );
            if (res.ok === true) {
              setProductInput(initialProductState);
              setManufacturerId("");
              setProductCreated(true);
              setTimeout(() => {
                setProductCreated(false);
              }, 3000);
            }
          });
        }}
        className="w-full max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md space-y-6"
      >
        <div className="flex justify-between">
          {" "}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Lägg till produkt
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Produktnamn
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ex: Logitech MX Master"
              required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#504136]"
              onChange={(e) =>
                setProductInput({ ...productInput, name: e.target.value })
              }
              value={productInput.name}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="sku" className="text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              type="text"
              value={productInput.sku}
              id="sku"
              name="sku"
              placeholder="Ex: SKU-QVMS12BL"
              required
              pattern="[A-Z0-9._-]+"
              title="Endast versaler A–Z, siffror, punkt, bindestreck och underscore"
              onBlur={(e) =>
                (e.currentTarget.value = e.currentTarget.value
                  .replace(/\s+/g, "")
                  .toUpperCase())
              }
              onChange={(e) =>
                setProductInput({ ...productInput, sku: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#504136]"
            />
            <p className="text-[11px] text-gray-500">
              Mellanslag tas bort och konverteras till versaler.
            </p>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Kategori
            </label>
            <input
              value={productInput.category}
              type="text"
              id="category"
              name="category"
              placeholder="Ex: Datormus"
              required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#504136]"
              onChange={(e) =>
                setProductInput({ ...productInput, category: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="manufacturer"
              className="text-sm font-medium text-gray-700"
            >
              Tillverkare
            </label>
            <select
              required
              id="manufacturer"
              name="manufacturer"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#504136] bg-white"
              value={manufacturerId}
              onChange={(e) => setManufacturerId(e.target.value)}
            >
              <option value="" disabled>
                Välj tillverkare
              </option>
              {manufacturers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="price"
              className="text-sm font-medium text-gray-700"
            >
              Pris
            </label>
            <input
              type="number"
              value={productInput.price}
              id="price"
              name="price"
              required
              min={1.0}
              step="1.00"
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#504136]"
              onChange={(e) =>
                setProductInput({ ...productInput, price: +e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="amountInStock"
              className="text-sm font-medium text-gray-700"
            >
              Lagersaldo
            </label>
            <input
              value={productInput.amountInStock}
              type="number"
              id="amountInStock"
              name="amountInStock"
              required
              min={0}
              step="1"
              placeholder="0"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#504136]"
              onChange={(e) =>
                setProductInput({
                  ...productInput,
                  amountInStock: +e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Beskrivning
          </label>
          <textarea
            value={productInput.description}
            id="description"
            name="description"
            required
            rows={6}
            placeholder="Kort produktbeskrivning..."
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#504136]"
            onChange={(e) =>
              setProductInput({ ...productInput, description: e.target.value })
            }
          />
        </div>
        <div className="flex w-full items-center justify-end gap-5 ">
          {message ? (
            <Alert
              icon={<ErrorIcon fontSize="inherit" />}
              severity="error"
              className={
                message ? "opacity-100" : "opacity-0 pointer-events-none"
              }
            >
              {message}
            </Alert>
          ) : (
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              className={
                productCreated ? "opacity-100" : "opacity-0 pointer-events-none"
              }
            >
              Product Added!
            </Alert>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              type="reset"
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#504136] px-4 py-2 text-sm font-medium text-white shadow hover:brightness-110 cursor-pointer"
            >
              Spara
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
