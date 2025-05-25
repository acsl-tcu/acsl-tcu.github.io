import { myFetchGet } from './myFetchGet';


interface Item {
  id: number;
  tid: string | number;
  [key: string]: unknown; // 他に必要なプロパティがあれば適宜追加
}

type SetCRUDAction = (action: {
  type: string;
  id?: number[] | number;
  Where?: Record<string, string>;
  route?: string;
  setError?: Record<string, unknown>;
  Data?: Item[];
}) => void;

export const DeleteItemsForItem = (
  itemIds: number[],
  targetTable: string,
  relatedTable: string,
  setImageCRUD: SetCRUDAction
): void => {
  myFetchGet(targetTable, { Where: { table: relatedTable } })
    .then((json: Item[]) => {
      console.log('Delete items ======', itemIds, json);
      const Dids = json.filter(item => itemIds.includes(Number(item.tid)));
      console.log(Dids.map(item => item.id));

      setImageCRUD({ type: 'D', id: Dids.map(item => item.id) });
      setImageCRUD({
        type: 'push_D',
        Where: { table: relatedTable },
        route: targetTable,
        setError: {},
        Data: json
      });
    })
    .catch((error) => {
      console.error('Error deleting items:', error);
    });
};

export default DeleteItemsForItem;