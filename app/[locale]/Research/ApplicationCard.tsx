import Image from "next/image";
import { MediaData } from "./ResearchInterface";

const Card: React.FC<{ items: MediaData[] }> = ({ items }) => {
  return (
    <li className="px-4 py-4 shadow-lg shadow-gray-300 rounded-2xl">
      <a href="#">
        <h3>{items[0].name}</h3>
        <div className="mt-3">
          <Image
            src={`/images/${items[0].name}.jpg`} alt={items[0].name}
            className="w-full aspect-square object-cover rounded-2xl"
          />
        </div>
      </a>
    </li>
  );
};

export default Card;