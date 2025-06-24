// components/StyledInput.js
import React from "react";

const StyledInput = ({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  accept,
}) => {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {Icon && <Icon className="text-gray-300" />}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        accept={accept}
        min={type === "number" ? 0 : undefined}
        className="pl-10 w-full p-2 text-white text-sm md:text-md rounded-md border-b-2 border-gray-300 focus:border-[#3b5787] bg-transparent focus:outline-none placeholder:text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-900 file:text-white hover:file:bg-cyan-800"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default StyledInput;
