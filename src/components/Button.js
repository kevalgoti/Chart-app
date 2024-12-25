import React from 'react'

function Button({ children, className,onClick, disabled = false, type = "button" }) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button