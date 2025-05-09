import * as React from 'react';

interface SelectorProps {
  title: string;
  contents: string[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Selector: React.FC<SelectorProps> = ({ title, contents, setValue }) => {
  const [selectorValue, setSelectorValue] = React.useState(contents[0]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectorValue(event.target.value);
    setValue(event.target.value);
  };

  return (
    <div className="m-2 min-w-[80px]">
      <label htmlFor="selector" className="block mb-1 text-sm font-semibold text-gray-700">
        {title}
      </label>
      <select
        id="selector"
        value={selectorValue}
        onChange={handleChange}
        className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        {contents.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
