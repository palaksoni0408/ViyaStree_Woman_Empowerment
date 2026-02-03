import React from 'react'

/**
 * PageHeader Component
 * 
 * Provides consistent page title + subtitle pattern across the application.
 * Part of the "Calm Authority" design system.
 * 
 * @param {string} title - Main page title
 * @param {string} subtitle - Explanatory subtitle (why this page matters)
 */
export default function PageHeader({ title, subtitle }) {
    return (
        <div className="page-header">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
    )
}
