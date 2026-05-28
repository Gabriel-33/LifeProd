// components/MonthPicker.tsx
'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MonthPicker({ value, onChange, placeholder }: MonthPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      onChange(`${year}-${month}`);
    } else {
      onChange('');
    }
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      locale={ptBR}
      placeholderText={placeholder || "MM/AAAA"}
      className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}