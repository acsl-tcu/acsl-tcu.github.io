'use client';

import { useState } from 'react';
import { TabPanel, getKeyByValue } from '@/app/components/Assets/ForTabs';
// import { GenTab } from '@/app/components/Assets/ForTabs';
import ReadFile from '@/app/components/MyCSV/ReadFile';
import GoodsTab from '@/app/components/MyTab/GoodsTab';
// import BookTab from '@/app/components/MyTab/BookTab';
import MemberTab from '@/app/components/MyTab/MemberTab';
// import SPAPhotoTab from '@/app/components/MySingleView/SPA_Photo';
// import SimpleTab from '@/app/components/Tabs/SimpleTab';

export default function Main() {
  const [value, setValue] = useState(0);
  const handleChange = (newValue: number) => setValue(newValue);

  const tab_list = ['備品管理', '名簿'];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Tabs */}
      <div className="bg-white rounded-2xl shadow mb-6 overflow-hidden">
        <div className="flex justify-center border-b">
          {tab_list.map((tabname, index) => (
            <button
              key={index}
              onClick={() => handleChange(index)}
              className={`px-4 py-2 w-full text-center text-sm font-semibold hover:bg-gray-100 transition-all
                ${value === index ? 'border-b-4 border-blue-500 text-blue-600 bg-gray-50' : 'text-gray-600'}`}
            >
              {tabname}
            </button>
          ))}
        </div>
      </div>

      {/* Contents */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-6">
        <TabPanel value={value} index={getKeyByValue(tab_list, 'CSV read')}>
          <ReadFile />
        </TabPanel>

        <TabPanel value={value} index={getKeyByValue(tab_list, '備品管理')}>
          <GoodsTab value={value} index={getKeyByValue(tab_list, '備品管理')} />
        </TabPanel>

        <TabPanel value={value} index={getKeyByValue(tab_list, '名簿')}>
          <MemberTab value={value} index={getKeyByValue(tab_list, '名簿')} />
        </TabPanel>

        {/* 他のタブも必要に応じて追加可能 */}
      </div>

      {/* Footer Tabs */}
      <div className="mt-8 flex justify-center space-x-4">
        {tab_list.map((tabname, index) => (
          <button
            key={"foot" + index}
            onClick={() => handleChange(index)}
            className={`px-4 py-1 text-sm font-medium rounded-full border
              ${value === index ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
          >
            {tabname}
          </button>
        ))}
      </div>
    </div>
  );
}