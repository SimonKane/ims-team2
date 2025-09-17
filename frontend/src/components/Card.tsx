interface CardProps {
  title: string;
  amount: number;
}

const Card = ({ title, amount }: CardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto flex flex-col items-center">
      {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
      <h2>{amount} </h2>
    </div>
  );
};

export default Card;
