import React from 'react'

interface TextProps {
  texts: string[]
  dispYear: number
  setDispYear: React.Dispatch<React.SetStateAction<number>>
  hrefs?: string[]
}

const YearSelector: React.FC<TextProps> = ({ texts, dispYear, setDispYear, hrefs = [] }) => {
  const thisYear = new Date().getFullYear()
  const year_list = Array.from({ length: thisYear - 2012 }, (_, index) => thisYear - index)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDispYear(Number(event.target.value))
  }

  if (!hrefs || hrefs.length === 0) {
    hrefs = texts.map((text) => `${text} ${dispYear}`)
  }

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-4sm p-4">
      <div className="flex items-end gap-3 m-2">
        <div className="relative">
          <input
            type="text"
            id="demo-select-small"
            className="peer block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="demo-select-small"
            className="absolute left-2 top-2 text-sm text-gray-500 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200"
          >
            Age
          </label>
        </div>
        {/* 年セレクター */}
        <div className="flex-col ">
          <label htmlFor="year-select" className="block mb-1 text-sm font-semibold text-gray-700">
            Select Year
          </label>
          <select
            id="year-select"
            value={dispYear}
            onChange={handleChange}
            className=" rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            {year_list.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* テキストボタン群 */}
        <div className="flex items-end gap-3 m-2">
          {texts.map((text, index) => (
            <a
              key={`${text}${dispYear}`}
              href={`#${hrefs[index]}`}
              className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.03] active:scale-100"
            >
              {text}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default YearSelector
