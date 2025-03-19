import React from 'react'

type TextInputProps = {
  id: string
  label: string
}

function TextInput({ id, label }: TextInputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}

export default TextInput