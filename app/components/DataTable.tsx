'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: readonly Column<T>[];
  onSync?: (data: T[]) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

export default function DataTable<T extends { id: string }>({
  data: initialData,
  columns,
  onSync
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [filtered, setFiltered] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [newItem, setNewItem] = useState<Partial<T>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftEdits, setDraftEdits] = useState<Record<string, Partial<T>>>({});

  useEffect(() => {
    setData(initialData);
    setFiltered(initialData);
  }, [initialData]);

  useEffect(() => {
    const lower = query.toLowerCase();
    setFiltered(
      data.filter(row =>
        Object.values(row).some(val =>
          val?.toString().toLowerCase().includes(lower)
        )
      )
    );
    setPage(0);
  }, [query, data]);

  const pageItems = useMemo(() => {
    return filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  }, [filtered, page]);

  const handleEdit = (id: string, field: keyof T, value: string) => {
    setDraftEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const applyEdit = (id: string) => {
    const updated = data.map(item =>
      item.id === id ? { ...item, ...draftEdits[id] } : item
    );
    setData(updated);
    setEditingId(null);
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

  const syncChanges = async () => {
    if (onSync) await onSync(data);
    else alert('Sync not implemented');
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <Card className="p-4">
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <table className="table-auto w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              {columns.map(col => (
                <th key={String(col.key)} className="p-2 border">{col.label}</th>
              ))}
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((row) => (
              <tr key={row.id} className="border-t">
                {columns.map(col => {
                  const key = col.key;
                  const value = editingId === row.id
                    ? draftEdits[row.id]?.[key] ?? row[key]
                    : row[key];

                  return (
                    <td key={String(key)} className="p-2 border">
                      {editingId === row.id ? (
                        <Input
                          value={String(value ?? '')}
                          onChange={(e) => handleEdit(row.id, key, e.target.value)}
                        />
                      ) : (
                        String(value ?? '')
                      )}
                    </td>
                  );
                })}
                <td className="p-2 border flex gap-2">
                  {editingId === row.id ? (
                    <Button size="sm" onClick={() => applyEdit(row.id)}>Save</Button>
                  ) : (
                    <Button size="sm" onClick={() => setEditingId(row.id)}><Pencil size={14} /></Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => deleteItem(row.id)}><Trash2 size={14} /></Button>
                </td>
              </tr>
            ))}

            {/* 新規行 */}
            <tr className="border-t">
              {columns.map(col => (
                <td key={String(col.key)} className="p-2 border">
                  <Input
                    placeholder={String(col.key)}
                    value={newItem[col.key] as string ?? ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, [col.key]: e.target.value }))}
                  />
                </td>
              ))}
              <td className="p-2 border">
                <Button size="sm" onClick={addItem}><Plus size={14} /></Button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center">
          <div className="space-x-2">
            <Button size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
          <div>Page {page + 1} / {totalPages}</div>
          <Button onClick={syncChanges}>Sync to DB</Button>
        </div>
      </CardContent>
    </Card>
  );
}
