import React from 'react'

function Input({type, name , placeholder, value, onChange,className, disabled }) {
  return (
    <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={className}
    disabled={disabled}
    />
  )
}

export default Input