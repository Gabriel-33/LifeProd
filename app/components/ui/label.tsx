// app/components/ui/label.tsx
import { LabelHTMLAttributes, forwardRef } from 'react';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', ...props }, ref) => {
    return <label ref={ref} className={`text-sm font-medium text-gray-700 ${className}`} {...props} />;
  }
);

Label.displayName = 'Label';