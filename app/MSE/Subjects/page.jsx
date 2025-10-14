// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import SimpleTable from '@/app/components/DataTable/SimpleTable';
import { TeacherColumns } from '../../Dashboard/Teacher';

export default function DashboardPage() {
  const [table, setTable] = useState('curriculum/teachers');
  const [data, setData] = useState([]);
  useEffect(() => {
    setTable(localStorage.getItem('table') || table);
    fetch(`https://acsl-hp.vercel.app/api/${table}`, {
      method: 'GET',
      credentials: 'include', // ← 認証用Cookie を送るのに必要
    })
      .then((res) => {
        if (!res.ok) throw new Error('認証エラーまたはデータ取得エラー');
        return res.json();
      })
      .then((data) => {
        setData(data.message);
      })
      .catch((err) => {
        console.log(err)
        window.location.href = '/Login?redirect=/MSE/Teachers';
      });
  }, [table]);
   
  return (
    <div className="px-2 w-full">
      {<SimpleTable columns={TeacherColumns} data={data}/>}      
    </div>
  );
}
