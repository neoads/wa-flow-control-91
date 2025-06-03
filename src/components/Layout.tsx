
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Aplicar modo escuro globalmente
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
