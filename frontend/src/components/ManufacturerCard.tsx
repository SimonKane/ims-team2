import { useState, useEffect } from "react";
import { type Manufacturer, type Contact } from "../../shared/types";
import CircularProgress from "@mui/material/CircularProgress";
import { BsPersonCircle } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

interface ManufacturerCardProps {
  id: string;
  closeModal: () => void;
  getName: (name: string) => void;
}

const ManufacturerCard = ({
  id,
  closeModal,
  getName,
}: ManufacturerCardProps) => {
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactModal, setContactModal] = useState<boolean>(false);

  const getManufacturerInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/manufacturers/${id}`);
      const data = await res.json();
      setManufacturer(data);
      getName(data.name);
      setIsLoading(false);
      setContact(data.contact);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getManufacturerInfo();
  }, []);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          duration: 0.45,
          bounce: 0.12,
          layout: { duration: 0.35, type: "spring", bounce: 0.1 },
        }}
        className="w-[640px] max-w-[90vw] min-h-[320px] bg-white shadow-lg flex items-center justify-center p-6 gap-10 rounded-2xl overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center ">
          {isLoading ? (
            <div className="w-100 h-100 flex items-center justify-center">
              <CircularProgress size={"4rem"} color={"inherit"} />
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {contactModal ? (
                <motion.div
                  key="contact"
                  layout
                  layoutId="panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center">
                    {contact?.name}
                  </h2>
                  <BsPersonCircle size={80} className="block mx-auto mt-2" />
                  <div className="mt-4 w-full mb-4">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-800 break-all">
                          {contact?.email ? (
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {contact.email}
                            </a>
                          ) : (
                            "—"
                          )}
                        </dd>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-800">
                          {contact?.phone || "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex gap-6 justify-center">
                    <button
                      onClick={() => setContactModal(false)}
                      className="px-6 py-3 rounded-xl bg-gray-200/90 text-[#504136] font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="info"
                  layout
                  layoutId="panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
                    {manufacturer?.name}
                  </h1>

                  <div className="mt-4 w-full mb-4">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-800">
                          {manufacturer?.address || "—"}
                        </dd>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Country
                        </dt>
                        <dd className="mt-1 text-sm text-gray-800">
                          {manufacturer?.country || "—"}
                        </dd>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm">
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

                      <div className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm sm:col-span-1">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Description:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-800 leading-relaxed">
                          {manufacturer?.description || "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex gap-6 justify-center">
                    <button
                      onClick={() => {
                        closeModal();
                      }}
                      className="px-6 py-3 rounded-xl bg-gray-200/90 text-[#504136] font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                    >
                      Display Products
                    </button>
                    <button
                      onClick={() => setContactModal(true)}
                      className="px-6 py-3 rounded-xl bg-gray-200/90 text-[#504136] font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                    >
                      Contact Manufacturer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ManufacturerCard;
