'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { handleImageUpload } from '@/app/components/DataTable/handleImageUpload';
import { ChangeEvent } from "react";
interface Column<T> {
  key: keyof T;
  label: string;
}

type WithIdentifier = { id: string, title: string };

interface DataTableProps<T extends WithIdentifier> {
  pageItems: T[];
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  columns: readonly Column<T>[];
}

export default function CardDisplay<T extends WithIdentifier>({
  pageItems,
  data,
  setData,
  columns,
}: DataTableProps<T>) {
  const [draftEdits, setDraftEdits] = useState<Record<string, Partial<T>>>({});

  const handleEdit = (id: string, field: keyof T, value: string) => {
    setDraftEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const applyEdit = (id: string) => {
    const updated = data.map(item =>
      id === item.id ? { ...item, ...draftEdits[id] } : item
    );
    setData(updated);
  };

  const updateImageUrl = (obj: { id: string, imageUrl: string[] }) => {
    console.log("Updating image URL for ID:", obj.id, "to", obj.imageUrl);
    setData(prev =>
      prev.map((row: T) =>
        row.id === obj.id ? { ...row, imageUrl: obj.imageUrl } : row
      )
    );
  };

  return (<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {pageItems
      .filter(item => ("disposal" in item) && (item.disposal === 0 || item.disposal === null || item.disposal === "false") || !("disposal" in item))
      .map((item, index) => (
        <Card key={item.id ?? index} className="w-full max-w-md flex flex-col rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
          {'number' in item ?
            (
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-800">
                  {String(item.number)}
                </h2>
              </CardHeader>
            ) :
            (
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-800">
                  {item.id}
                </h2>
              </CardHeader>
            )}

          {'imageUrl' in item ?
            (
              <CardContent className="items-center justify-center text-center">
                <div className="flex gap-2">
                  {Array.isArray(item.imageUrl) && item.imageUrl.length > 0 ?
                    (
                      <>
                        {(() => {
                          return (
                            <>
                              {item.imageUrl.map((src: string, idx: number) => (
                                <div key={idx} className="w-1/3 aspect-square relative">
                                  <Image
                                    src={src}
                                    alt={`image-${idx}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover rounded-lg border border-gray-100"
                                  />
                                </div>
                              ))}
                            </>
                          );
                        })()}
                      </>
                    )
                    : (<>No Image</>)
                  }
                </div>
              </CardContent>
            ) :
            (
              <div className="text-center text-sm text-muted-foreground">No image</div>
            )
          }

          {(String(item.title)) &&
            (<>
              <CardFooter className="text-center flex justify-center">
                <div
                  onDrop={async (e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;

                    if (files.length > 0) {
                      const fakeEvent = {
                        target: { files },
                      } as unknown as ChangeEvent<HTMLInputElement>;

                      const ret = await handleImageUpload(fakeEvent, item.id);

                      if (ret) {
                        updateImageUrl({ id: ret.id, imageUrl: ret.imageUrl });
                      }
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 p-4 rounded-md hover:bg-gray-100 transition cursor-pointer"
                >
                  <label className="cursor-pointer inline-flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <input
                      type="file"
                      multiple
                      onChange={async (e) => {
                        const ret = await handleImageUpload(e, item.id);
                        if (ret) {
                          updateImageUrl({ id: ret?.id, imageUrl: ret?.imageUrl });
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  {String(item.title)}
                </p>
              </CardFooter>
              <CardFooter>
                <>
                  {columns.map(col => {
                    // const key = (col.key === 'place' ? 'place' : (col.key === 'responsiblePerson' ? 'responsiblePerson' : null));
                    const key = col.key as keyof T;
                    const rowid = item.id;
                    return (
                      ((key && key in item) ?
                        <Input
                          key={`${rowid}-${String(col.key)}`}
                          value={String((draftEdits[rowid]?.[key as keyof T] ?? item[key as keyof T]) || '')}
                          placeholder={col.key === 'place' ? '設置場所' : '使用者'} // 表示だけに使う
                          onChange={(e) => { handleEdit(rowid, col.key, e.currentTarget.value) }
                          }
                          onBlur={() => applyEdit(rowid)}
                          className="transition-all duration-200 transform hover:scale-105 hover:bg-blue-50 focus:ring-2 focus:ring-blue-400"
                        /> : null)
                    )
                  })}
                </>
              </CardFooter>
            </>
            )}
        </Card>
      ))
    }
  </ul>
  );
}