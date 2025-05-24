// components/BookList.tsx
'use client';

import React from 'react';

type Book = {
  id: number;
  title: string;
  author: string;
};

type Props = {
  books: Book[];
};

export default function BookList({ books }: Props) {
  console.log(books);
  console.log(books.length);
  if (!books.length) {
    return <p className="text-gray-500">書籍データがありません。</p>;
  }

  return (
    <ul className="space-y-2">
      {books.map((book) => (
        <li key={book.id} className="p-4 border rounded-md shadow-sm">
          <h2 className="text-lg font-semibold">{book.title}</h2>
          <p className="text-sm text-gray-600">著者: {book.author}</p>
        </li>
      ))}
    </ul>
  );
}
