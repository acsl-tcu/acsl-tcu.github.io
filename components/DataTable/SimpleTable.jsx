'use client';
import { Card, CardContent } from '@/components/ui/card';


export default function SimpleTable({
  columns,
  data
}) {
  console.log(data)
  console.log(columns)
  return (
    <Card className="py-4 px-0" >
      <CardContent>
        {/* Header */}
        <div className="mb-4 flex flex-wrap gap-2">
          {columns.map(col => (
            <label key={String(col.key)} className="flex items-center gap-1">              
              <span>{col.label}</span>
            </label>
          ))}
          </div>
        {/* 本体 */}
            <table className="table-auto w-full border text-sm">
      <thead>
   
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} className="p-1 border">
              {col.label}
            </th>
          ))}
          <th className="p-1 border"></th>
        </tr>        
      </thead>
      {/* Table Mainデータ */}
      <tbody>
        {data.map((row,index) => (
          <tr key={index} className="border-t">
            {columns.map(col => {
              const key = col.key;
              const value = row[key];
              return (
                <td key={String(key)} className="p-2 border">
                    {value}
                </td>
              );
            })}
          </tr>
        ))}    
      </tbody>
    </table>    
      </CardContent>
    </Card >
  );
}