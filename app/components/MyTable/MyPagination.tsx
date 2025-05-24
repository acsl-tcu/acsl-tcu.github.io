'use client';

import { FC } from 'react';

interface MyPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (e: any, newPage: number) => void;
  handleChangeRowsPerPage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MyPagination: FC<MyPaginationProps> = ({
  count,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => handleChangePage(e, 0)}
          disabled={page === 0}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ⏮
        </button>
        <button
          onClick={(e) => handleChangePage(e, page - 1)}
          disabled={page === 0}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ◀
        </button>
        <span>
          Page {page + 1} of {totalPages || 1}
        </span>
        <button
          onClick={(e) => handleChangePage(e, page + 1)}
          disabled={page >= totalPages - 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ▶
        </button>
        <button
          onClick={(e) => handleChangePage(e, totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ⏭
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="rows-per-page">Rows per page:</label>
        <select
          id="rows-per-page"
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          className="border px-2 py-1 rounded"
        >
          {[5, 10, 25, -1].map((opt) => (
            <option key={opt} value={opt}>
              {opt === -1 ? 'All' : opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MyPagination;
