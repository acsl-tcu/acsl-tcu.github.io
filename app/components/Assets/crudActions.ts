// utils/crudActions.ts

import { sendRequest, fetchData } from './fetchHelpers';
import { CRUDState, CRUDInfo, DataItem } from './types';

export const CRUDActions = async (state: CRUDState, info: CRUDInfo): Promise<CRUDState> => {
  const tmp = { ...state };
  let route = `/goods?table=${info.table}`;
  if (info.route) route = `/${info.route}`;

  switch (info.type) {
    case 'push_C': {
      if (info.C) tmp.C = info.C;
      if (tmp.C.length === 0) break;

      if ('files' in info.Data) {
        const formData = new FormData();
        (info.Data.data as DataItem[]).forEach((data, i) => {
          if (tmp.C.includes(data.id)) {
            formData.append('files', info.Data.files[i]);
            formData.append('data', JSON.stringify(data));
          }
        });
        await sendRequest('POST', route, formData, true);
      } else {
        const filtered = (info.Data as DataItem[]).filter((v) => tmp.C.includes(v.id)).map(({ id, ...rest }) => rest);
        await sendRequest('POST', route, filtered);
      }
      tmp.C = [];
      break;
    }

    case 'push_R': {
      const data = await fetchData(route, info) as DataItem[];
      info.set?.(data);
      break;
    }

    case 'push_U': {
      if (info.U) tmp.U = info.U;
      if (tmp.U.length === 0) break;

      const onServer = await fetchData(route, info) as DataItem[];
      const Uid = tmp.U.filter((v) => onServer.some((s) => s.id === v));
      const targetU = (info.Data as DataItem[]).filter((v) => Uid.includes(v.id));
      await sendRequest('PUT', route, targetU);
      tmp.U = [];
      break;
    }

    case 'push_D': {
      if (info.D) tmp.D = info.D;
      if (tmp.D.length === 0) break;

      const onServer = await fetchData(route, info) as DataItem[];
      const files = onServer.filter((v) => tmp.D.includes(v.id));
      await sendRequest('DELETE', route, files);
      tmp.D = [];
      break;
    }

    case 'C':
      tmp.C.push(info.id);
      break;

    case 'U':
      if (!tmp.C.includes(info.id)) tmp.U.push(info.id);
      break;

    case 'D': {
      const tmpc = tmp.C.indexOf(info.id);
      if (tmpc !== -1) {
        tmp.C.splice(tmpc, 1);
        break;
      }
      tmp.D.push(info.id);
      const tmpu = tmp.U.indexOf(info.id);
      if (tmpu !== -1) tmp.U.splice(tmpu, 1);
      break;
    }

    default:
      break;
  }

  return tmp;
};
