import React from "react";

interface CardProps {
  _id: string;
  amountInStock: number;
  category: string;
  createdAt: string;
  description: string;
  manufacturer: string;
  name: string;
  price: number;
  sku: string;
  updatedAt: string;
  __v?: number;
}

const Card: React.FC<CardProps> = ({
  _id,
  amountInStock,
  category,
  createdAt,
  description,
  manufacturer,
  name,
  price,
  sku,
  updatedAt,
  __v,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 border border-gray-200 text-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-1">{name}</h2>
      <p className="text-gray-600 mb-1 line-clamp-3">{description}</p>

      <div className="mt-2 space-y-1 text-gray-700">
        <p>
          <span className="font-medium">Category:</span> {category}
        </p>
        <p>
          <span className="font-medium">Manufacturer:</span> {manufacturer}
        </p>
        <p>
          <span className="font-medium">In Stock:</span> {amountInStock}
        </p>
        <p>
          <span className="font-medium">SKU:</span> {sku}
        </p>
        <p>
          <span className="font-medium">ID:</span> {_id}
        </p>
        <p className="text-xs text-gray-500">
          Created: {new Date(createdAt).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">
          Updated: {new Date(updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-4 text-xl font-semibold text-blue-600">
        ${price.toFixed(2)}
      </div>
    </div>
  );
};

export default Card;
