'use client';
import React from 'react';

interface TextProps {
  texts: string[];
  dispYear: number;
  setDispYear: React.Dispatch<React.SetStateAction<number>>;
  hrefs?: string[];
}

const YearSelector: React.FC<TextProps> = ({ texts, dispYear, setDispYear, hrefs = [] }) => {
  const thisYear = new Date().getFullYear();
  const year_list = Array.from({ length: thisYear - 2012 }, (_, index) => thisYear - index);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDispYear(Number(event.target.value));
  };

  if (!hrefs || hrefs.length === 0) {
    hrefs = texts.map((text) => `${text} ${dispYear}`);
  }

  return (
    <div className="overflow-x-auto shadow rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
        {/* 年セレクター */}
        <div className="w-full lg:w-48">
          <label htmlFor="year-select" className="block mb-1 text-sm font-medium text-gray-700">
            Year
          </label>
          <select
            id="year-select"
            value={dispYear}
            onChange={handleChange}
            className="form-select w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {year_list.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* テキストボタン群 */}
        <div className="flex flex-wrap gap-3">
          {texts.map((text, index) => (
            <a
              key={`${text}${dispYear}`}
              href={`#${hrefs[index]}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-transform transform hover:scale-105"
            >
              {text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearSelector;
