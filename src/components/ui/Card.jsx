export default function Card({ children, className = '', title, icon, action }) {
  return (
    <div className={`bg-space-800 rounded-2xl border border-space-700 overflow-hidden ${className}`}>
      {(title || icon) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-space-700">
          <div className="flex items-center gap-3">
            {icon && <span className="text-xl">{icon}</span>}
            {title && <h3 className="font-display font-semibold text-lg">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}