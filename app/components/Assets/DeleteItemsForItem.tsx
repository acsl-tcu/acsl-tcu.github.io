import { myFetchGet } from './myFetchGet';

export const DeleteItemsForItem = (
  itemIds: number[],
  targetTable: string,
  relatedTable: string,
  setImageCRUD: (action: any) => void
): void => {
  myFetchGet(targetTable, { Where: { table: relatedTable } })
    .then((json: any[]) => {
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