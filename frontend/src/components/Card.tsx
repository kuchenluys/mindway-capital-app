import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={clsx(
        'bg-dark-800 border border-dark-700 rounded-xl p-6',
        hover && 'hover:border-dark-600 transition',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, icon, subtitle }) => (
  <div className="mb-4 pb-4 border-b border-dark-700">
    <div className="flex items-center gap-2 mb-1">
      {icon && <span className="text-2xl">{icon}</span>}
      <h3 className="text-lg font-bold text-dark-100">{title}</h3>
    </div>
    {subtitle && <p className="text-sm text-dark-400">{subtitle}</p>}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={clsx('mt-4 pt-4 border-t border-dark-700', className)}>
    {children}
  </div>
);

export default Card;
