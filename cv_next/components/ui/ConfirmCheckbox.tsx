import React from "react";

interface ConfirmCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  message: string;
  id?: string;
  className?: string;
}

export const ConfirmCheckbox: React.FC<ConfirmCheckboxProps> = ({
  checked,
  onChange,
  message,
  id = "confirmation-checkbox",
  className = "",
}) => (
  <div className={`mt-2 flex items-center ${className}`}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <label htmlFor={id} className="text-sm ">
      {message}
    </label>
  </div>
);
