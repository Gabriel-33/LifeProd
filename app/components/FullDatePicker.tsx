// components/FullDatePicker.tsx
'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';

interface FullDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FullDatePicker({ value, onChange, placeholder }: FullDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const day = String(date.getDate()).padStart(2, '0');  // ← CORREÇÃO: getDate(), não getDay()
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      onChange(`${year}-${month}-${day}`);  // ← CORREÇÃO: formato ISO YYYY-MM-DD
    } else {
      onChange('');
    }
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      dateFormat="dd/MM/yyyy"  // ← CORREÇÃO: dd/MM/yyyy (minúsculo)
      locale={ptBR}
      placeholderText={placeholder || "DD/MM/AAAA"}
      className="w-full px-13 py-2 mt-1 ml-10 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export function FullDatePickerBlock({ value, onChange, placeholder }: FullDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const day = String(date.getDate()).padStart(2, '0');  // ← CORREÇÃO: getDate(), não getDay()
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      onChange(`${year}-${month}-${day}`);  // ← CORREÇÃO: formato ISO YYYY-MM-DD
    } else {
      onChange('');
    }
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      dateFormat="dd/MM/yyyy"  // ← CORREÇÃO: dd/MM/yyyy (minúsculo)
      locale={ptBR}
      placeholderText={placeholder || "DD/MM/AAAA"}
      className="w-full px-13 py-2 mt-1 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}