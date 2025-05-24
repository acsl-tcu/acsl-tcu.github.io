'use client';

import { memo } from 'react';
import { TabPanel } from '@/app/components/Assets/ForTabs';
import MyTable from '@/app/components/MyTable/MyTable';
import { useGoodsTableLogic } from './useGoodsTableLogic';
import { FunctionalButton1, FunctionalButton2, FunctionalButton3 } from './FunctionalButton';
import { CRUDState } from '@/app/components/Assets/types';

interface SimpleTabProps {
  value: number;
  index: number;
  table?: string;
}

const SimpleTab = memo(({ value, index, table }: SimpleTabProps) => {
  const logic = useGoodsTableLogic(table);

  const flistForGoods = {
    FunctionalButton1: () => <FunctionalButton1 {...logic} />,
    FunctionalButton2: () => <FunctionalButton2 {...logic} />,
    FunctionalButton3: () => <FunctionalButton3 {...logic} />,
  };

  return (
    <TabPanel value={value} index={index}>
      <MyTable
        actions={logic.goods_actions}
        head_data={logic.goods_head_data}
        checker={logic.goods_checker}
        setCRUD={logic.setCRUD}
        flist={flistForGoods}
        Data={logic.Goods}
        Data0={logic.Goods0}
        Update={logic.Update}
        fUpdate={logic.fUpdate}
        setData={logic.setGoods}
        setData0={logic.setGoods0}
        pageError={logic.pageError}
        detailedItem={logic.goods_data}
        SV={logic.SingleView}
      />
    </TabPanel>
  );
});

export default SimpleTab;
