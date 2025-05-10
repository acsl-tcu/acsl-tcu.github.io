export default function GroupedSelectTailwind() {
  return (
    <div className="space-y-4 p-4">
      {/* ネイティブの grouped select */}
      <div className="flex flex-col">
        <label htmlFor="grouped-native-select" className="mb-1 text-sm font-medium text-gray-700">
          Grouping
        </label>
        <select
          id="grouped-native-select"
          defaultValue=""
          className="block w-48 rounded border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="" disabled hidden>
            Select an option
          </option>
          <optgroup label="Category 1">
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
          </optgroup>
          <optgroup label="Category 2">
            <option value={3}>Option 3</option>
            <option value={4}>Option 4</option>
          </optgroup>
        </select>
      </div>

      {/* フラットな選択肢にセクションヘッダ風要素（擬似 ListSubheader） */}
      <div className="flex flex-col">
        <label htmlFor="grouped-select" className="mb-1 text-sm font-medium text-gray-700">
          Grouping
        </label>
        <select
          id="grouped-select"
          defaultValue=""
          className="block w-48 rounded border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">None</option>
          <option disabled className="font-semibold text-gray-500">
            --- Category 1 ---
          </option>
          <option value={1}>Option 1</option>
          <option value={2}>Option 2</option>
          <option disabled className="font-semibold text-gray-500">
            --- Category 2 ---
          </option>
          <option value={3}>Option 3</option>
          <option value={4}>Option 4</option>
        </select>
      </div>
    </div>
  );
}
