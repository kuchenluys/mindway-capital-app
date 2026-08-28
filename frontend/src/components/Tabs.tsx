import React from 'react';
import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 border-b border-dark-700 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            'px-4 py-3 font-medium text-sm whitespace-nowrap transition border-b-2 -mb-px',
            activeTab === tab.id
              ? 'text-primary-400 border-b-primary-400'
              : 'text-dark-400 border-b-transparent hover:text-dark-300'
          )}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
