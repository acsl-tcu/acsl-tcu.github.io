// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">404 - ページが見つかりません</h1>
      <p className="mt-4 text-gray-600">指定されたページは存在しないか、移動された可能性があります。</p>
    </div>
  );
}
