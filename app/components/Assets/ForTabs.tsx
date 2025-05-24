'use client';

import { useState, ReactNode } from 'react';

interface TabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
}

export function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className="transition-all duration-300"
    >
      {value === index && <div className="py-4">{children}</div>}
    </div>
  );
}

export const GenTab = (label: string, index: number) => {
  return (
    <button
      key={"tab-" + index}
      id={`full-width-tab-${index}`}
      aria-controls={`full-width-tabpanel-${index}`}
      className="px-4 py-2"
    >
      {label}
    </button>
  );
};

export const getKeyByValue = (object: string[], value: string): number => {
  return parseInt(Object.keys(object).find((key) => object[parseInt(key)] === value) || '-1');
};
