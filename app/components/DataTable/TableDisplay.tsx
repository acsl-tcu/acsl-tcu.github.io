'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import Image from 'next/image';
import { handleImageUpload } from '@/app/components/DataTable/handleImageUpload';
interface Column<T> {
  key: keyof T;
  label: string;
}

type WithIdentifier = { id: string, title: string };

interface DataTableProps<T extends WithIdentifier> {
  globalFilteredData: T[];
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  columns: readonly Column<T>[];
  visibleKeys: (keyof T)[];
  page: number;
  setPage: (page: number) => void;
  ITEMS_PER_PAGE: number;
}

export default function TableDisplay<T extends WithIdentifier>({
  globalFilteredData,
  data,
  setData,
  columns,
  visibleKeys,
  page,
  setPage,
  ITEMS_PER_PAGE,
}: DataTableProps<T>) {
  const [filtered, setFiltered] = useState<T[]>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<T>>({});
  const [draftEdits, setDraftEdits] = useState<Record<string, Partial<T>>>({});

  useEffect(() => {
    setFiltered(globalFilteredData);
  }, [globalFilteredData]);

  useEffect(() => {
    // console.log("Column filters:", columnFilters);
    const filteredByColumns = globalFilteredData.filter(row => {
      return Object.entries(columnFilters).every(([key, value]) => {
        return row[key as keyof T]?.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
    console.log("Filtered data:", filteredByColumns);
    setFiltered(filteredByColumns);
    setPage(0);
  }, [columnFilters, globalFilteredData, setPage]);
  const pageItems = useMemo(() => {
    return filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  }, [filtered, page, ITEMS_PER_PAGE]);

  const handleEdit = (id: string, field: keyof T, value: string) => {
    setDraftEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const deleteItem = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const addItem = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const newRow = { ...newItem, id } as T;
    setData(prev => [...prev, newRow]);
    setNewItem({});
  };

  const applyEdit = (id: string) => {
    const updated = data.map(item =>
      id === item.id ? { ...item, ...draftEdits[id] } : item
    );
    setData(updated);
    setEditingId(null);
  };


  const updateImageUrl = (obj: { id: string, imageUrl: string[] }) => {
    console.log("Updating image URL for ID:", obj.id, "to", obj.imageUrl);
    setData(prev =>
      prev.map((row: T) =>
        row.id === obj.id ? { ...row, imageUrl: obj.imageUrl } : row
      )
    );
  };

  return (  // Table表示
    <table className="table-auto w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          {columns.filter(col => visibleKeys.includes(col.key)).map(col => (
            <th key={String(col.key)} className="p-2 border">{col.label}</th>
          ))}
          <th className="p-2 border">Actions</th>
        </tr>
        <tr>
          {columns.filter(col => visibleKeys.includes(col.key)).map(col => (
            <th key={String(col.key)} className="p-1 border">
              <Input
                className="text-xs"
                placeholder="filter"
                value={columnFilters[String(col.key)] ?? ''}
                onChange={(e) => (e.target.value === '' ?
                  setColumnFilters(prev => {
                    const updated = { ...prev };
                    delete updated[String(col.key)];
                    return updated;
                  }) :
                  setColumnFilters(prev => ({
                    ...prev,
                    [String(col.key)]: e.target.value,
                  }))
                )}
              />
            </th>
          ))}
          <th className="p-1 border"></th>
        </tr>
        {/* 新規追加 */}
        <tr className="border-t">
          {columns.filter(col => visibleKeys.includes(col.key)).map(col => (
            <td key={String(col.key)} className="p-2 border">
              <Input
                placeholder={String(col.key)}
                value={(newItem[col.key] as string) ?? ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, [col.key]: e.target.value }))}
                className="transition-all duration-200 transform hover:scale-105 hover:bg-blue-50 focus:ring-2 focus:ring-blue-400"
              />
            </td>
          ))}
          <td className="p-2 border">
            <Button size="sm" onClick={addItem}><Plus size={14} /></Button>
          </td>
        </tr>
      </thead>
      {/* Table Mainデータ */}
      <tbody>
        {pageItems.map((row: T) => (
          <tr key={row.id} className="border-t">
            {columns.filter(col => visibleKeys.includes(col.key)).map(col => {
              const key = col.key;
              const rowid = row.id;
              const value = editingId === rowid
                ? draftEdits[rowid]?.[key] ?? row[key]
                : row[key];

              return (
                <td key={String(key)} className="p-2 border">
                  {editingId === row.id ? (
                    <Input
                      value={String(value ?? '')}
                      onChange={(e) => handleEdit(editingId, key, e.target.value)}
                      className="transition-all duration-200 transform hover:scale-105 hover:bg-blue-50 focus:ring-2 focus:ring-blue-400"
                    />
                  )
                    : (key === 'title' && typeof value === 'string'
                      ?
                      (<div className="text-center p-2 ">
                        <div>{String(value ?? '')}</div>
                        {("imageUrl" in row && Array.isArray(row.imageUrl) && row.imageUrl.length > 0)
                          ? (
                            <Image
                              src={row.imageUrl[0]}
                              alt="uploaded"
                              width={64}
                              height={64}
                              className="object-cover rounded" // 任意で角丸など追加
                            />
                          )
                          :
                          (<div>
                            画像
                            <label className="cursor-pointer inline-flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                              <Upload className="w-5 h-5 text-gray-600" />
                              <input
                                type="file"
                                multiple
                                onChange={async (e) => {
                                  const ret = await handleImageUpload(e, rowid);
                                  if (ret) {
                                    updateImageUrl({ id: ret?.id, imageUrl: ret?.imageUrl });
                                  }
                                }}
                                accept="image/*"
                                className="hidden"
                              />
                            </label></div>
                          )}
                      </div>)
                      : String(value ?? ''))
                  }
                </td>
              );
            })}
            {/* 保存・削除 */}
            <td className="p-2 border flex flex-wrap gap-2">
              {editingId === row.id ? (
                <Button size="sm" onClick={() => applyEdit(row.id)}>Save</Button>
              ) : (
                <Button size="sm" onClick={() => setEditingId(row.id)}><Pencil size={14} /></Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => deleteItem(row.id)}><Trash2 size={14} /></Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
