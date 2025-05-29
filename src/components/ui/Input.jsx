import React from "react";
import "./Input.css"; // Import CSS file

const Input = ({ type, placeholder, value, onChange, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input-field ${className}`}
    />
  );
};

export default Input;
