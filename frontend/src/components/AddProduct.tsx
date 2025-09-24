const AddProduct = () => {
  return (
    <div>
      <form
        action="submit"
        className="w-full max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Lägg till produkt
        </h2>

        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-600">
            Produktnamn
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Ex: Logitech MX Master"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#504136]"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="reset"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#504136] px-4 py-2 text-sm font-medium text-white shadow hover:brightness-110"
          >
            Spara
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
