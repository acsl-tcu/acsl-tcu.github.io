'use client';

import { useState, useReducer, useLayoutEffect, ChangeEvent, FormEvent } from 'react';
import { CRUDActions } from '../Assets/crudActions';

interface ImageItem {
  id: number;
  file?: File;
  image?: string;
  type: string;
}

interface RenderImageListProps {
  item: { id: number };
  table: string;
  Images: ImageItem[];
}

export const RenderImageList = ({ item, table, Images }: RenderImageListProps) => {
  const tid = item.id;
  const [CRUD, setCRUD] = useReducer(CRUDActions, { C: [], U: [], D: [] });
  const [images, setImages] = useState<ImageItem[]>(Images);
  const maxN = 4;
  const [fDisable, setDisable] = useState(false);

  useLayoutEffect(() => {
    if (!(Images.length > 0)) {
      setCRUD({
        type: 'push_R',
        Where: { relation: `${table}_${tid}` },
        route: 'images',
        set: (json: ImageItem[]) => setImages(json),
        setError: {},
      });
    }
    setDisable(true);
  }, [Images]);

  const handleOnAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (images.length + e.target.files.length > maxN) {
      setDisable(true);
    } else {
      setDisable(false);
    }

    let addIds = [...Array(e.target.files.length)].map((_, i) => i);
    if (images.length > 0) {
      addIds = addIds.map((i) => images.slice(-1)[0].id + 1 + i);
    }

    setCRUD({ type: 'C', id: addIds });
    const addedFiles: ImageItem[] = addIds.map((id, index) => ({ id, file: e.target.files![index], type: 'local' }));
    setImages([...images, ...addedFiles]);
  };

  const handleOnRemoveImage = (index: number) => {
    const newImages = [...images];
    const target = newImages.splice(index, 1)[0];
    if (newImages.length <= maxN) setDisable(false);
    setImages(newImages);
    setCRUD({ type: 'D', id: target.id });
  };

  return (
    <div>
      <PhotoSelectButton handleOnAddImage={handleOnAddImage} fDisable={images.length >= maxN} />
      <PhotoUploadButton
        fDisable={fDisable}
        images={images}
        CRUD={CRUD}
        setCRUD={setCRUD}
        setDisable={setDisable}
        table={table}
        tid={tid}
      />
      <div className="grid grid-cols-5 gap-2 max-w-5xl max-h-[200px] mt-2">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => handleOnRemoveImage(index)}
              className="absolute top-0 left-0 text-gray-500 hover:text-red-600"
            >
              ×
            </button>
            <img
              className="aspect-[9/16] object-cover"
              alt={`image-${index}`}
              src={image.type === 'URL' ? image.image : URL.createObjectURL(image.file!)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface PhotoUploadButtonProps {
  fDisable: boolean;
  images: ImageItem[];
  CRUD: any;
  setCRUD: any;
  setDisable: (v: boolean) => void;
  table: string;
  tid: number;
}

const PhotoUploadButton = ({ fDisable, images, CRUD, setCRUD, setDisable, table, tid }: PhotoUploadButtonProps) => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDisable(true);
    registerImages(e, images, CRUD, setCRUD, table, tid);
  };

  return (
    <form onSubmit={onSubmit} className="my-2">
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" disabled={fDisable}>
        変更反映
      </button>
    </form>
  );
};

interface PhotoSelectButtonProps {
  handleOnAddImage: (e: ChangeEvent<HTMLInputElement>) => void;
  fDisable: boolean;
}

const PhotoSelectButton = ({ handleOnAddImage, fDisable }: PhotoSelectButtonProps) => (
  <label className="block my-2 cursor-pointer">
    <span className={`inline-block px-4 py-2 rounded ${fDisable ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}>
      写真選択
      {fDisable && <span className="text-red-600 ml-2">（最大４枚）</span>}
    </span>
    <input
      type="file"
      multiple
      disabled={fDisable}
      accept="image/*,.png,.jpg,.jpeg,.gif"
      onChange={handleOnAddImage}
      className="hidden"
    />
  </label>
);

export function registerImages(
  e: FormEvent,
  images: ImageItem[],
  CRUD: any,
  setCRUD: any,
  table: string,
  tid: number
) {
  const isURL = images[0].type === 'URL';
  const data = images.map((img) => {
    if (!CRUD.C.includes(img.id)) return null;
    return {
      tid: String(tid),
      table,
      relation: `${table}_${tid}`,
      item_id: img.id,
      path: '',
      org_name: isURL ? '' : img.file?.name,
      ext: isURL ? '' : img.file?.name?.split('.').pop(),
      type: isURL ? 'URL' : img.file?.type,
      size: isURL ? 0 : img.file?.size,
      image: isURL ? img.file : `${table}_${tid}_${img.id}.${img.file?.name?.split('.').pop()}`,
      created_at: formatDate(new Date())
    };
  }).filter(Boolean);

  if (isURL) {
    setCRUD({ type: 'push_C', all: 1, C: [0], table: 'images', Data: data });
  } else {
    const files = images.filter((img) => CRUD.C.includes(img.id)).map((img) => img.file);
    setCRUD({ type: 'push_D', Where: { relation: `${table}_${tid}` }, route: 'images', setError: {}, Data: images });
    setCRUD({
      type: 'push_C',
      Where: { relation: `${table}_${tid}` },
      route: 'images',
      setError: {},
      Data: { data, files },
      config: { headers: { 'content-type': 'multipart/form-data' } }
    });
  }
}

function formatDate(dt: Date) {
  const y = dt.getFullYear();
  const m = ('00' + (dt.getMonth() + 1)).slice(-2);
  const d = ('00' + dt.getDate()).slice(-2);
  return `${y}-${m}-${d}`;
}

export default RenderImageList;
