
export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  overview: string;
  pubdate: string;
  publisher: string;
  imageUrl?: string[];
}

export const BookColumns = [
  { key: 'isbn', label: 'ISBN' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'pubdate', label: 'Pubdate' },
  { key: 'imageUrl', label: 'Image', type: 'image' }
] as const;

export const book_table_title = "書籍一覧";
