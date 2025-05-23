import Image from "next/image";
import { CardProps } from "./ResearchInterface";

const Card: React.FC<CardProps> = ({ items, set }) => {
  return (
    <li className="px-4 py-4 shadow-lg shadow-gray-300 rounded-2xl" onClick={() => set(items)}>
      <a href="#app_content">
        <h4>{items[0].name.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}</h4>
        <div className="mt-3">
          <Image
            src={`/images/${items[0].name}.jpg`} alt={items[0].name}
            width={400}
            height={400}
            sizes="100vw"
            priority
            className="w-full aspect-square object-cover rounded-2xl"
          />
        </div>
      </a>
    </li>
  );
};

export default Card;