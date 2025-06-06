'use client';

import CardDisplay from './CardDisplay';
import TableDisplay from './TableDisplay';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Printer, FileDown } from 'lucide-react';
import Toast from '@/components/ui/Toast';
import { exportCSV, exportXLSX, printTable } from '@/lib/exporters';
import { useToast } from '@/hooks/useToast';
import VarSelector from '@/app/components/VarSelector';

interface Column<T> {
  key: keyof T;
  label: string;
}

type WithIdentifier = { id: string, title: string };

interface DataTableProps<T extends WithIdentifier> {
  data: T[];
  columns: readonly Column<T>[];
  onSync?: (data: T[]) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

export default function DataTable<T extends WithIdentifier>({
  data: initialData,
  columns,
  onSync,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [filtered, setFiltered] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [globalQuery, setGlobalQuery] = useState('');
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
    setData(initialData);
    setFiltered(initialData);
  }, [initialData]);
  useEffect(() => {
    setFtable(localStorage.getItem('ftable') || ftable);
  }, [ftable]);

  useEffect(() => {
    const lowerGlobal = globalQuery.toLowerCase();
    const filteredByGlobal = data.filter(row =>
      Object.values(row).some(val =>
        val?.toString().toLowerCase().includes(lowerGlobal)
      )
    );
    // console.log("Filtered by global query:", filteredByGlobal);
    setFiltered(filteredByGlobal);
    setPage(0);
  }, [globalQuery, data]);


  const pageItems = useMemo(() => {
    return filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  }, [filtered, page]);

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
          </Button><br />
          <Button size="sm" onClick={() => printTable(data, visibleKeys)}><Printer size={14} className="mr-1" />印刷</Button>
          <Button size="sm" onClick={() => exportCSV(data, visibleKeys)}><FileDown size={14} className="mr-1" />CSV</Button>
          <Button size="sm" onClick={() => exportXLSX(data, visibleKeys)}><FileDown size={14} className="mr-1" />XLSX</Button>
          <Button
            onClick={syncChanges}
            disabled={isSaving}
            className="transition-all duration-200 transform hover:scale-105 hover:bg-green-600 focus:ring-2 focus:ring-green-400 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Sync to DB'}
          </Button>
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
          <CardDisplay pageItems={pageItems} data={data} setData={setData} columns={columns} />
          :
          <TableDisplay globalFilteredData={filtered} data={data} setData={setData} columns={columns} visibleKeys={visibleKeys} page={page} setPage={setPage}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE} />
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