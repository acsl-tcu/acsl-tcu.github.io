'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Printer, FileDown, Upload } from 'lucide-react';
import Toast from '@/components/ui/Toast';
import { exportCSV, exportXLSX, printTable } from '@/lib/exporters';
import { useToast } from '@/hooks/useToast';
import VarSelector from '@/app/components/VarSelector';
import Image from 'next/image';

interface Column<T> {
  key: keyof T;
  label: string;
}

type WithIdOrItemNumber = { id: string } | { itemNumber: string };

interface DataTableProps<T extends WithIdOrItemNumber> {
  data: T[];
  columns: readonly Column<T>[];
  onSync?: (data: T[]) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;
export default function DataTable<T extends WithIdOrItemNumber>({
  data: initialData,
  columns,
  onSync,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [filtered, setFiltered] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [globalQuery, setGlobalQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [newItem, setNewItem] = useState<Partial<T>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftEdits, setDraftEdits] = useState<Record<string, Partial<T>>>({});
  const storageKey = 'visibleColumns_' + columns.map(c => c.key).join('_');
  const [isSaving, setIsSaving] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<(keyof T)[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return columns.map(c => c.key);
        }
      }
    }
    return columns.map(c => c.key);
  });
  const [ftable, setFtable] = useState<string>('0');
  const ftableValue = ['0', '1'];
  const ftableLables = ['Card', 'Table'];

  const { toast, showToast } = useToast();

  const syncChanges = async () => {
    if (!onSync) {
      showToast('Sync not implemented', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await onSync(data);
      showToast('同期完了しました', 'success');
    } catch {
      showToast('保存に失敗しました', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleKeys));
  }, [visibleKeys, storageKey]);

  useEffect(() => {
    setFtable(localStorage.getItem('ftable') || ftable);
    setData(initialData);
    setFiltered(initialData);
  }, [initialData, ftable]);

  useEffect(() => {
    const lowerGlobal = globalQuery.toLowerCase();
    const filteredByGlobal = data.filter(row =>
      Object.values(row).some(val =>
        val?.toString().toLowerCase().includes(lowerGlobal)
      )
    );
    // console.log("Filtered by global query:", filteredByGlobal);
    // console.log("Column filters:", columnFilters);
    const filteredByColumns = filteredByGlobal.filter(row => {
      return Object.entries(columnFilters).every(([key, value]) => {
        return row[key as keyof T]?.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
    // console.log("Filtered data:", filteredByColumns);
    setFiltered(filteredByColumns);
    setPage(0);
  }, [globalQuery, columnFilters, data]);

  const pageItems = useMemo(() => {
    return filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  }, [filtered, page]);

  const handleEdit = (id: string, field: keyof T, value: string) => {
    setDraftEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const applyEdit = (id: string) => {
    const updated = data.map(item =>
      id === ("id" in item ? item.id : item.itemNumber) ? { ...item, ...draftEdits[id] } : item
    );
    setData(updated);
    setEditingId(null);
  };

  const deleteItem = (id: string) => {
    setData(prev => prev.filter(item => ("id" in item ? item.id : item.itemNumber) !== id));
  };

  const addItem = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const newRow = { ...newItem, id } as T;
    setData(prev => [...prev, newRow]);
    setNewItem({});
  };

  const updateImageUrl = (id: string, imageUrl: string) => {
    console.log("Updating image URL for ID:", id, "to", imageUrl);
    setData(prev =>
      prev.map((row: T) =>
        ("id" in row ? row.id : row.itemNumber) === id ? { ...row, imageUrl } : row
      )
    );
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('id', id);

  //   const res = await fetch('/api/upload-image', {// BOX
  //     method: 'POST',
  //     body: formData,
  //   });

  //   const { imageUrl } = await res.json();
  //   updateImageUrl(id, imageUrl); // state更新などで反映
  // };

  // フロント側（e.g., DataTable.tsx）
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    rowId: string
  ) => {
    const files = event.target.files ? Array.from(event.target.files) : null;
    console.log("Selected files:", files);
    if (!files) return;

    try {
      const formData = new FormData();

      formData.append('rowId', rowId); // ファイル名として使う

      files.map((file, index) => {
        const count = index + 1; // ファイル名のカウント
        const filename = file.name || '';
        const ext = typeof filename === 'string'
          ? filename.split('.').pop() || 'jpg'
          : 'jpg';
        const finalName = `${rowId}_${count}.${ext}`;
        console.log(`Appending file: ${finalName}`);
        formData.append('file', file, finalName);
        // formData.append(finalName, file); // {rowid_1.jpg:file1, rowid_2.png:file2, ...}
      })

      const res = await fetch('https://acsl-hp.vercel.app/api/upload-box', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) throw new Error('アップロードに失敗しました');

      const data = await res.json();
      const imageUrl = data.urls;
      console.log("Uploaded image URL:", imageUrl);
      if (!imageUrl) throw new Error('画像URLが取得できませんでした');

      updateImageUrl(rowId, imageUrl); // state更新などで反映
    } catch (err) {
      console.error(err);
      alert('画像のアップロードに失敗しました');
    }
  };

  return (
    <Card className="py-4 px-0" >
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {columns.map(col => (
            <label key={String(col.key)} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={visibleKeys.includes(col.key)}
                onChange={() => {
                  setVisibleKeys(prev =>
                    prev.includes(col.key)
                      ? prev.filter(k => k !== col.key)
                      : [...prev, col.key]
                  );
                }}
              />
              <span>{col.label}</span>
            </label>
          ))}
          <Button size="sm" onClick={() => setVisibleKeys(
            visibleKeys.length === columns.length ? [] : columns.map(c => c.key)
          )}>
            {visibleKeys.length === columns.length ? 'すべて非表示' : 'すべて表示'}
          </Button>
          <Button size="sm" onClick={() => printTable(data, visibleKeys)}><Printer size={14} className="mr-1" />印刷</Button>
          <Button size="sm" onClick={() => exportCSV(data, visibleKeys)}><FileDown size={14} className="mr-1" />CSV</Button>
          <Button size="sm" onClick={() => exportXLSX(data, visibleKeys)}><FileDown size={14} className="mr-1" />XLSX</Button>
          <VarSelector vars={ftableValue} labels={ftableLables} current={ftable} setVar={(f: string) => { localStorage.setItem('ftable', f); console.log(f); setFtable(f); }} />
        </div>
        {/* 全体を通した検索 */}
        <div className="mb-4">
          <Input
            placeholder="Search..."
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {ftable === '0' ?
          // Card表示
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {pageItems.map((item, index) => (
              <Card key={("id" in item ? item.id : item.itemNumber) ?? index} className="p-2 gap-1">
                {'title' in item && String(item.title) && (
                  <CardTitle>
                    <p className="text-sm font-bold">{String(item.title)}</p>
                  </CardTitle>
                )}
                {'name' in item && String(item.name) && (
                  <CardTitle>
                    <p className="text-sm font-bold">{String(item.name)}</p>
                  </CardTitle>
                )}
                {'number' in item ?
                  (
                    <CardFooter className="px-0">
                      <span className="text-sm text-muted-foreground">{String(item.number)}</span>
                    </CardFooter>
                  ) :
                  (
                    <CardFooter>
                      <span className="text-sm text-muted-foreground">ID: {("id" in item ? item.id : item.itemNumber)}</span>
                    </CardFooter>
                  )}
              </Card>
            ))
            }
          </ul>
          :
          // Table表示
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
            {/* Mainデータ */}
            <tbody>
              {pageItems.map((row: T) => (
                <tr key={"id" in row ? row.id : row.itemNumber} className="border-t">
                  {columns.filter(col => visibleKeys.includes(col.key)).map(col => {
                    const key = col.key;
                    let rowid: string;
                    if ("id" in row) {
                      rowid = row.id;
                    } else {
                      rowid = row.itemNumber;
                    }
                    const value = editingId === rowid
                      ? draftEdits[rowid]?.[key] ?? row[key]
                      : row[key];

                    return (
                      <td key={String(key)} className="p-2 border">
                        {editingId === ("id" in row ? row.id : row.itemNumber) ? (
                          <Input
                            value={String(value ?? '')}
                            onChange={(e) => handleEdit("id" in row ? row.id : row.itemNumber, key, e.target.value)}
                            className="transition-all duration-200 transform hover:scale-105 hover:bg-blue-50 focus:ring-2 focus:ring-blue-400"
                          />
                        )
                          : (key === 'title' || key === 'name' || key === 'itemName' && typeof value === 'string'
                            ?
                            (<div className="text-center p-2 ">
                              <div>{String(value ?? '')}</div>
                              {("imageUrl" in row && typeof row.imageUrl === "string")
                                ? (
                                  <Image
                                    src={row.imageUrl}
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
                                      onChange={(e) => handleImageUpload(e, rowid)}
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
                    {editingId === ("id" in row ? row.id : row.itemNumber) ? (
                      <Button size="sm" onClick={() => applyEdit("id" in row ? row.id : row.itemNumber)}>Save</Button>
                    ) : (
                      <Button size="sm" onClick={() => setEditingId("id" in row ? row.id : row.itemNumber)}><Pencil size={14} /></Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => deleteItem("id" in row ? row.id : row.itemNumber)}><Trash2 size={14} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="space-x-2">
            <Button size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button
              size="sm"
              disabled={page >= Math.ceil(filtered.length / ITEMS_PER_PAGE) - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>

          <div className="flex items-center gap-2">
            Page
            <Input
              type="number"
              className="w-16 text-center"
              value={page + 1}
              min={1}
              max={Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value)) {
                  const maxPage = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
                  const newPage = Math.min(Math.max(value, 1), maxPage) - 1;
                  setPage(newPage);
                }
              }}
            />
            / {Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))}
          </div>

          <Button
            onClick={syncChanges}
            disabled={isSaving}
            className="transition-all duration-200 transform hover:scale-105 hover:bg-green-600 focus:ring-2 focus:ring-green-400 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Sync to DB'}
          </Button>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </CardContent>
    </Card >
  );
}