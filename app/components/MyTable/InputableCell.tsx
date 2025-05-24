'use client';

import { useLayoutEffect, useState, forwardRef } from 'react';

type InputableCellProps = {
  id: string;
  fEdit: boolean;
  value: string;
  default: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  maxRows?: number;
};

export const InputableCell = forwardRef<HTMLInputElement, InputableCellProps>((props, ref) => {
  return (
    <td key={"IC_" + props.id + props.default} id={"styled_" + props.id} className="p-1 border">
      <MyInput
        id={props.id}
        fEdit={props.fEdit}
        value={props.value}
        default={props.default}
        onChange={props.onChange}
        onBlur={props.onBlur}
        ref={ref}
        update={props.fEdit}
        type={props.type}
        maxRows={props.maxRows}
      />
    </td>
  );
});

export const MyInput = forwardRef<HTMLInputElement, InputableCellProps & { update: boolean }>((props, ref) => {
  const [value, setValue] = useState(" ");

  useLayoutEffect(() => {
    if (props.value !== null) {
      setValue(props.value);
    }
  }, [props.value, props.update]);

  function onChangeAction(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    props.onChange(e.target.value);
  }

  return (
    <input
      ref={ref}
      id={"Input_" + props.default + props.id}
      type={props.type || 'text'}
      readOnly={!props.fEdit}
      placeholder={props.default}
      value={value}
      onChange={onChangeAction}
      onBlur={props.onBlur}
      className={`w-full px-2 py-1 text-sm border ${props.fEdit ? 'border-gray-400' : 'border-transparent'} rounded bg-white`}
    />
  );
});

export default InputableCell;
