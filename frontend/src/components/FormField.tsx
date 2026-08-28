import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import Input from './Input';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  icon?: string;
  required?: boolean;
  disabled?: boolean;
  help?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps<any>>(
  (
    {
      name,
      control,
      label,
      placeholder,
      type = 'text',
      icon,
      required = false,
      disabled = false,
      help,
    },
    ref
  ) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            {label && (
              <label className="block text-dark-300 text-sm font-medium mb-2">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
              </label>
            )}
            <Input
              {...field}
              ref={ref}
              type={type}
              placeholder={placeholder}
              icon={icon}
              disabled={disabled}
              error={error?.message}
            />
            {help && !error && (
              <p className="text-dark-500 text-xs mt-1">{help}</p>
            )}
          </div>
        )}
      />
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
