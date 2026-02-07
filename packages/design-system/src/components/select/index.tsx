'use client';

// TODO: (주찬) 아직 작업 중인 컴포넌트입니다. [24-03-30]

import { useControllableState } from '@hooks';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SelectOption } from './SelectOption';
import { SelectOptions } from './SelectOptions';
import { SelectSearchInput } from './SelectSearchInput';
import { SelectTrigger } from './Trigger';

type ValueType = string | string[] | undefined | null;
export const SelectActionsContext = createContext<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectValue: (value: string) => void;
} | null>(null);
SelectActionsContext.displayName = 'SelectActionsContext';

export const SelectDataContext = createContext<{
  open: boolean;
  selectedValue?: ValueType;
} | null>(null);
SelectDataContext.displayName = 'SelectDataContext';

interface SelectRootProps {
  defaultValue?: ValueType;
  value?: ValueType;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
  onChange?(value?: ValueType): void;
}
const SelectRoot = ({
  defaultValue,
  value: controlledValue,
  onChange: controlledOnChange,
  children,
  multiple = false,
}: SelectRootProps) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedValue = multiple ? [] : undefined, setSelectedValue] =
    useControllableState<ValueType>(
      controlledValue,
      controlledOnChange,
      defaultValue,
    );

  const handleSelectValue = useCallback(
    (item: string) => {
      let selectedList;
      const itemExists = selectedValue?.includes(item);

      if (multiple && selectedValue instanceof Array) {
        selectedList = itemExists
          ? selectedValue.filter((value) => value !== item)
          : [...selectedValue, item];
      } else {
        selectedList = itemExists ? null : item;
      }

      setSelectedValue(selectedList);
    },
    [multiple, selectedValue],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const actions = useMemo(
    () => ({
      setOpen,
      handleSelectValue,
    }),
    [handleSelectValue],
  );

  const data = useMemo(
    () => ({
      open,
      selectedValue,
    }),
    [open, selectedValue],
  );
  return (
    <SelectActionsContext.Provider value={actions}>
      <SelectDataContext.Provider value={data}>
        <div ref={selectRef} style={{ position: 'relative' }}>
          {children}
        </div>
      </SelectDataContext.Provider>
    </SelectActionsContext.Provider>
  );
};

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  SearchInput: SelectSearchInput,
  Options: SelectOptions,
  Option: SelectOption,
});
