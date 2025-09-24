import { useState, useEffect } from "react";
import { type Manufacturer } from "../../shared/types";
// import { BsEmojiSunglasses } from "react-icons/bs";
import CircularProgress from "@mui/material/CircularProgress";

interface ManufacturerCardProps {
  id: string;

  closeModal: () => void;
}

const ManufacturerCard = ({ id, closeModal }: ManufacturerCardProps) => {
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getManufacturerInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/manufacturers/${id}`);
      const data = await res.json();
      setManufacturer(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getManufacturerInfo();
  }, []);

  return (
    <>
      <div
        className={` bg-white shadow-lg flex items-center justify-center p-6 gap-10 rounded-2xl overflow-hidden
       max-w-3xl`}
      >
        <div className="flex flex-col items-center justify-center ">
          {isLoading ? (
            <div className="w-100 h-100 flex items-center justify-center">
              <CircularProgress size={"4rem"} color={"inherit"} />
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
                {manufacturer?.name}
              </h1>
              <div className="mt-4 w-full mb-4">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm hover:shadow transition">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-800">
                      {manufacturer?.address || "—"}
                    </dd>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm hover:shadow transition">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Country
                    </dt>
                    <dd className="mt-1 text-sm text-gray-800">
                      {manufacturer?.country || "—"}
                    </dd>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm hover:shadow transition">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Website
                    </dt>
                    <dd className="mt-1 text-sm">
                      {manufacturer?.website ? (
                        <a
                          href={manufacturer.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline break-all"
                          title={manufacturer.website}
                        >
                          {manufacturer.website}
                        </a>
                      ) : (
                        <span className="text-gray-800">—</span>
                      )}
                    </dd>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm hover:shadow transition sm:col-span-1">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Description:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-800 leading-relaxed">
                      {manufacturer?.description || "—"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex gap-6 ">
                <button
                  onClick={() => closeModal()}
                  className="px-6 py-3 rounded-xl bg-gray-200/90 text-[#504136] font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                >
                  Display Products
                </button>
                <button
                  onClick={() => getManufacturerInfo()}
                  className="px-6 py-3 rounded-xl bg-gray-200/90 text-[#504136] font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                >
                  Contact Manufacturer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ManufacturerCard;
