'use client';

import { useState, useLayoutEffect, useReducer, memo } from 'react';
import MyTable from '@/app/components/MyTable/MyTable';
import ReadCSVButton from '@/app/components/MyCSV/ReadCSVButton';
import { TabPanel } from '@/app/components/Assets/ForTabs';
import { CRUDActions } from '@/app/components/Assets/crudActions';
import excelWrite from '@/app/components/MyCSV/excelWrite';
import { MyInput } from '@/app/components/MyTable/InputableCell';

interface MemberTabProps {
  value: number;
  index: number;
}

const MemberTab = memo(({ value, index }: MemberTabProps) => {
  const table_name = 'member';
  const [CRUD, setCRUD] = useReducer(CRUDActions, { C: [], U: [], D: [] });
  const [Members, setMembers] = useState<any[]>([]);
  const [Members0, setMembers0] = useState<any[]>([]);
  const [fUpdate, Update] = useState(0);
  const [pageError, setError] = useState(0);

  const member_data = {
    student_id: '学番',
    full_name: '名前',
    name: '名（kazuma）',
    surname: '姓（sekiguchi）',
    gaccount: 'Gmail account',
    theme_j: '研究テーマ',
    theme_e: 'Research topic',
    in_year: '配属年度',
    out_year: '卒業・修了年度',
    degree: '学位',
    company: '就職先'
  };

  const member_actions = [
    'surname',
    'name',
    'full_name',
    'theme_j',
    'theme_e',
    'student_id',
    'gaccount',
    'in_year'
  ];

  const member_head_data = Object.fromEntries(
    member_actions.map((k) => [k, member_data[k]])
  );

  const member_checker = (member: any) => {
    return member.full_name ? member : false;
  };

  useLayoutEffect(() => {
    setCRUD({
      type: 'push_R',
      table: table_name,
      set: (json: any[]) => {
        setMembers(json);
        setMembers0(json);
        Update((v) => v + 1);
      },
      setError,
    });
  }, []);

  const transpose = (a: any[][]) => a[0].map((_, c) => a.map((r) => r[c]));

  const mapArrayToWorkItem = (data: any[][]) => {
    return data.map((row, index) => {
      const tmp = new Map(transpose([Object.keys(member_data), row]));
      return Object.assign({ id: index }, Object.fromEntries(tmp));
    });
  };

  const ReadCSV2MemberTable = (results: any) => {
    results.data.splice(0, 2); // skip headers
    const mapped = mapArrayToWorkItem(results.data);
    setCRUD({ type: 'C', id: mapped.map((_, i) => i) });
    setMembers(mapped);
    Update((v) => v + 1);
  };

  const registerData = () => {
    setCRUD({ type: 'push_C', all: 1, table: table_name, Data: Members });
  };

  const flistForMembers = {
    FunctionalButton2: () => (
      <button className="btn btn-blue" onClick={registerData}>データベースに登録</button>
    ),
    FunctionalButton3: () => (
      <>
        {ReadCSVButton((results) => ReadCSV2MemberTable(results))}
        {excelWrite(Object.keys(member_data), Members)}
      </>
    )
  };

  const SingleView = ({ item, fEdit, onChange, inputRefs }: any) => (
    <tr className="border-t">
      <td></td>
      <td colSpan={member_actions.length} className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {Object.keys(member_data).map((act, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">{member_data[act]}</label>
              <MyInput
                id={item.id}
                fEdit={fEdit}
                value={item[act]}
                default={member_data[act]}
                onChange={(v) => onChange(act, v)}
                ref={inputRefs[act]}
                update={fEdit}
              />
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  return (
    <TabPanel value={value} index={index}>
      <MyTable
        actions={member_actions}
        head_data={member_head_data}
        checker={member_checker}
        setCRUD={setCRUD}
        flist={flistForMembers}
        Data={Members}
        Data0={Members0}
        Update={Update}
        fUpdate={fUpdate}
        setData={setMembers}
        setData0={setMembers0}
        pageError={pageError}
        detailedItem={member_data}
        SV={SingleView}
      />
    </TabPanel>
  );
});

export default MemberTab;
