import React from 'react'

/**
 * Badge Component
 * 
 * Pill-style badge for skills, status, or tags.
 * Part of the "Calm Authority" design system.
 * 
 * @param {string} children - Badge text content
 * @param {string} variant - 'default'|'success'|'teal'|'accent'
 */
export default function Badge({ children, variant = 'default' }) {
    const className = variant === 'default'
        ? 'badge'
        : `badge badge-${variant}`

    return (
        <span className={className}>
            {children}
        </span>
    )
}
