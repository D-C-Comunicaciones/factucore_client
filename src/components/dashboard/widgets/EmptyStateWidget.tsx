"use client";
import React from 'react';

interface EmptyStateWidgetProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export function EmptyStateWidget({ title, subtitle, icon }: EmptyStateWidgetProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center py-12">
      {icon || (
        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )}
      <h4 className="text-base font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 text-center max-w-xs">{subtitle}</p>
    </div>
  );
}
