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
        {/* 年セレクター */}
        <div className="flex-col relative">
          <label htmlFor="year-select" className="block mb-1 text-sm font-semibold text-gray-700 
          absolute left-2 top-0 bg-white">
            Select Year
          </label>
          <select
            id="year-select"
            value={dispYear}
            onChange={handleChange}
            className=" rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm w-20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
