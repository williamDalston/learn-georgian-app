import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface BaseFieldProps {
  label: string
  error?: string
  required?: boolean
  helperText?: string
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {
  rows?: number
}

// Mobile-optimized Input Field
export const MobileFormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        <label 
          htmlFor={props.id || props.name} 
          className="block text-sm font-sans font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
        <input
          ref={ref}
          {...props}
          className={`
            w-full px-4 py-3 text-base
            border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            transition-colors
            touch-manipulation
            ${error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id || props.name}-error` : helperText ? `${props.id || props.name}-helper` : undefined}
        />
        {helperText && !error && (
          <p 
            id={`${props.id || props.name}-helper`}
            className="mt-1 text-sm text-gray-500 font-sans"
          >
            {helperText}
          </p>
        )}
        {error && (
          <p 
            id={`${props.id || props.name}-error`}
            className="mt-1 text-sm text-red-600 font-sans"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

MobileFormInput.displayName = 'MobileFormInput'

// Mobile-optimized Textarea Field
export const MobileFormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, helperText, className = '', rows = 4, ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        <label 
          htmlFor={props.id || props.name} 
          className="block text-sm font-sans font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          rows={rows}
          {...props}
          className={`
            w-full px-4 py-3 text-base
            border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            transition-colors resize-y
            touch-manipulation
            ${error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id || props.name}-error` : helperText ? `${props.id || props.name}-helper` : undefined}
        />
        {helperText && !error && (
          <p 
            id={`${props.id || props.name}-helper`}
            className="mt-1 text-sm text-gray-500 font-sans"
          >
            {helperText}
          </p>
        )}
        {error && (
          <p 
            id={`${props.id || props.name}-error`}
            className="mt-1 text-sm text-red-600 font-sans"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

MobileFormTextarea.displayName = 'MobileFormTextarea'

