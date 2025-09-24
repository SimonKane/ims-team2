import React from "react";

interface CardProps {
  title: string;
  amount: number;
  price: number;
  category: string;
}

const Card: React.FC<CardProps> = ({ title, amount, price, category }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="p-4 flex flex-col h-full justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium">Category:</span> {category}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium">In Stock:</span> {amount}
          </p>
        </div>
        <div className="mt-4">
          <p className="text-xl font-semibold text-blue-600">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
