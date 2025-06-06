// DB => API 変換関数
export const BookConvertToAPIFormat = (rows: BookDB[]): BookAPI[] => rows.map(({ isbn, ...rest }) => ({ id: isbn, ...rest, }));
// API から DB 変換関数
export const BookConvertToDBFormat = (rows: BookAPI[]): BookDB[] => rows.map(({ id, ...rest }) => ({ isbn: id, ...rest, }));

export interface BookAPI {
  id: string;
  title: string;
  author: string;
  overview: string;
  pubdate: string;
  publisher: string;
  imageUrl?: string[];
}
export interface BookDB {
  isbn: string;
  title: string;
  author: string;
  overview: string;
  pubdate: string;
  publisher: string;
  imageUrl?: string[];
}

export const BookColumns = [
  { key: 'id', label: 'ISBN' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'pubdate', label: 'Pubdate' },
  { key: 'imageUrl', label: 'Image', type: 'image' }
] as const;

export const book_table_title = "書籍一覧";
