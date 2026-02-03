import React from 'react'

/**
 * InfoCard Component
 * 
 * Standard white card container for content.
 * Part of the "Calm Authority" design system.
 * 
 * @param {string} title - Optional card title
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 */
export default function InfoCard({ title, children, className = '' }) {
    return (
        <div className={`card ${className}`}>
            {title && <h3 className="card-title">{title}</h3>}
            {children}
        </div>
    )
}
