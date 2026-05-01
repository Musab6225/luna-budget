export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const variants = {
    primary: 'bg-moon-500 hover:bg-moon-400 text-white shadow-lg shadow-moon-500/25',
    secondary: 'bg-space-700 hover:bg-space-600 text-white border border-space-600',
    ghost: 'hover:bg-space-700/50 text-gray-300 hover:text-white',
    success: 'bg-growth hover:bg-growth/90 text-white shadow-lg shadow-growth/25',
    danger: 'bg-danger hover:bg-danger/90 text-white',
    outline: 'border-2 border-moon-500 text-moon-300 hover:bg-moon-500/10',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-200 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}