// TODO: (주찬) 아직 작업 중인 컴포넌트입니다. [24-03-17]

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SelectTrigger } from './Trigger';
import { SelectSearchInput } from './SelectSearchInput';
import { SelectOptions } from './SelectOptions';
import { SelectOption } from './SelectOption';
import { forwardRefWithAs } from '@utils';

const SelectActionsContext = createContext<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectItem: (item: string) => void;
} | null>(null);
SelectActionsContext.displayName = 'SelectActionsContext';
export const useActions = (component: string) => {
  const context = useContext(SelectActionsContext);
  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <Select /> component.`,
    );
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, useActions);
    }
    throw err;
  }
  return context;
};
type _Actions = ReturnType<typeof useActions>;

const SelectDataContext = createContext<{
  open: boolean;
  selectedItem: string[];
} | null>(null);
SelectDataContext.displayName = 'SelectDataContext';

export const useData = (component: string) => {
  const context = useContext(SelectDataContext);
  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <Select /> component.`,
    );
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, useData);
    }
    throw err;
  }
  return context;
};
type _Data = ReturnType<typeof useData>;

export interface CommonProps {
  children?: React.ReactNode;
  className?: string;
}
type Props = {
  selected: string[];
  multiple?: boolean;
  onSubmit(arg: string[]): void;
} & CommonProps;
const SelectRoot = ({
  selected,
  onSubmit,
  children,
  multiple = false,
}: Props) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string[]>(selected);

  const handleSelectItem = useCallback(
    (item: string) => {
      let updatedSelected;
      const isItemSelected = selectedItem.includes(item);

      if (multiple) {
        updatedSelected = isItemSelected
          ? selectedItem.filter((selectedItem) => selectedItem !== item)
          : [...selectedItem, item];
      } else {
        updatedSelected = isItemSelected ? [] : [item];
      }

      setSelectedItem(updatedSelected);
    },
    [multiple, selectedItem],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        onSubmit(selectedItem);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSubmit, selectedItem, setOpen]);

  const actions = useMemo<_Actions>(
    () => ({
      setOpen,
      handleSelectItem,
    }),
    [setOpen, handleSelectItem],
  );

  const data = useMemo<_Data>(
    () => ({
      open,
      selectedItem,
    }),
    [open, selectedItem],
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
  Trigger: forwardRefWithAs(SelectTrigger),
  SearchInput: forwardRefWithAs(SelectSearchInput),
  Options: forwardRefWithAs(SelectOptions),
  Option: forwardRefWithAs(SelectOption),
});
