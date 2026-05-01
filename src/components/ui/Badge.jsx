export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-space-700 text-gray-300',
    success: 'bg-growth/20 text-growth border border-growth/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    danger: 'bg-danger/20 text-danger border border-danger/30',
    info: 'bg-nebula-400/20 text-nebula-300 border border-nebula-400/30',
    moon: 'bg-moon-500/20 text-moon-300 border border-moon-500/30',
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}