import React from 'react';

type BadgeProps = {
    variant: 'trend' | 'status' | 'severity' | 'report';
    label: string;
};

const Badge: React.FC<BadgeProps> = ({ variant, label }) => {
    const variantClasses = {
        trend: 'bg-blue-500 text-white',
        status: 'bg-green-500 text-white',
        severity: 'bg-red-500 text-white',
        report: 'bg-yellow-500 text-black',
    };

    return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${' + variantClasses[variant] + '`}>
            {label}
        </span>
    );
};

export default Badge;