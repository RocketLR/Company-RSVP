import * as React from "react"
import { InputHTMLAttributes } from 'react'


export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`bg-gray-800 text-gray-100 border-gray-700 focus:border-gray-500 focus:ring-gray-500 ${className}`}
      {...props}
    />
  )
}
