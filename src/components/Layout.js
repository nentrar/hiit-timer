import React from 'react';
import { Menu } from 'lucide-react';

const Layout = ({ children, title, onMenuClick, showMenu = true, hideHeader = false }) => (
  <div className="min-h-screen bg-white text-black">
    {!hideHeader && (
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-black z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {showMenu && (
            <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          )}
          {!showMenu && <div className="w-10" />}
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="w-10" />
        </div>
      </header>
    )}
    <div className={hideHeader ? '' : 'pt-16'}>
      {children}
    </div>
  </div>
);

export default Layout;