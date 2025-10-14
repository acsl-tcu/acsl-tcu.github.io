// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import SimpleTable from '@/app/components/DataTable/SimpleTable';
// import { SubjectConvertToAPIFormat, SubjectConvertToDBFormat, SubjectColumns, subject_table_title } from '../Dashboard/Subjects';
// import type { SubjectAPI, SubjectDB } from '../Dashboard/Subjects';
// import { TeacherConvertToAPIFormat, TeacherConvertToDBFormat, TeacherColumns, teacher_table_title } from '../Dashboard/Teachers';
// import type { TeacherAPI, TeacherDB } from '../Dashboard/Teachers';
import { TeacherConvertToAPIFormat, TeacherColumns } from '../Dashboard/Teachers';

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
        window.location.href = '/Login';
      });
  }, [table]);

  return (
    <div className="px-2 w-full">
      {<SimpleTable columns={TeacherColumns} data={TeacherConvertToAPIFormat(data)}/>}      
    </div>
  );
}
