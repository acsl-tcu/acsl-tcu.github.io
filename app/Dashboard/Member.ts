
export interface Member {
  id: string;
  isbn: string;
  title: string;
  author: string;
  overview: string;
  pubdate: string;
  publisher: string;
  imageUrl?: string;
}

export const MemberColumns = [
  { key: 'isbn', label: 'ISBN' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'pubdate', label: 'Pubdate' },
] as const;

export const member_table_title = '会員一覧';
