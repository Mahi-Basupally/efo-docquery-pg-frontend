'use client'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <div className={`page-header page-header--secondary ${className}`}>
      <ul className="breadcrumbs">
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumbs__item ${index > 0 ? 'breadcrumbs__item--current' : ''}`}
          >
            {index > 0 && <span className="breadcrumbs__separator">&gt;</span>}
            {item.href ? (
              <a
                rel="noopener noreferrer"
                className="breadcrumbs__link"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span className="breadcrumbs__link">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}