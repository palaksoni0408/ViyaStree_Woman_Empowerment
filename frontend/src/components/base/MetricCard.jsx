import React from 'react'

/**
 * MetricCard Component
 * 
 * Displays numerical metrics with labels (e.g., empowerment score).
 * Part of the "Calm Authority" design system.
 * 
 * @param {string|number} value - The metric value to display
 * @param {string} label - Descriptive label for the metric
 * @param {string} variant - 'large' or 'small' (default: large)
 */
export default function MetricCard({ value, label, variant = 'large' }) {
    return (
        <div className={variant === 'large' ? 'metric-card' : 'metric-item'}>
            <div className={variant === 'large' ? 'metric-value' : 'metric-item-value'}>
                {value}
            </div>
            <div className={variant === 'large' ? 'metric-label' : 'metric-item-label'}>
                {label}
            </div>
        </div>
    )
}
