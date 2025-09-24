import * as motion from "motion/react-client";

interface CardProps {
  id?: string;
  title: string;
  amount: number;
  delay?: number;
  manufacturer?: string;
  choice?: string;
  total?: number;
  price?: number;
  setShowModal?: () => void;
}

const Card = ({
  title,
  amount,
  delay,
  manufacturer,
  choice,
  total,
  setShowModal,
  price,
}: CardProps) => {
  return (
    <motion.div
      onClick={setShowModal}
      whileTap={choice !== "products" ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        choice !== "products"
          ? {
              duration: 0.4,
              delay,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.1 },
            }
          : { duration: 0.2, delay }
      }
      style={{
        pointerEvents: choice !== "products" ? "auto" : "none",
        cursor: choice !== "products" ? "pointer" : "default",
      }}
      className="w-full h-39 bg-white shadow-lg  rounded-lg p-6
                    flex flex-col items-center justify-between cursor-pointer"
    >
      <h3 className="text-xl font-semibold  text-center line-clamp-2">
        {title}
      </h3>
      {choice === "products" ? (
        <>
          <p className="text-sm text-gray-600">
            By:{" "}
            <span className="font font-semibold italic ">{manufacturer}</span>
          </p>
          <h2
            className={`text-2xl font-semibold ${
              amount < 6 ? "text-red-500" : "text-black"
            }`}
          >
            {amount}
            <span className="text-sm font-light text-gray-600"> in stock</span>
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-800">
            Price: $
            <span className="font-semibold text-[#504136]">{price}</span>
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600">Total Stock Value:</p>
          <h2 className=" text-2xl font-semibold ">
            <span className="text-green-800 text-3xl"> $ </span>
            {total?.toFixed(2)}
          </h2>
        </>
      )}
    </motion.div>
  );
};

export default Card;
