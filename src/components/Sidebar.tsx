
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Phone, 
  FolderOpen, 
  Users, 
  Shield, 
  Activity, 
  Link as LinkIcon,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/",
    description: "Visão geral"
  },
  {
    title: "Números",
    icon: Phone,
    href: "/numeros",
    description: "Gestão de linhas"
  },
  {
    title: "Projetos",
    icon: FolderOpen,
    href: "/projetos",
    description: "Organizar por projeto"
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/usuarios",
    description: "Equipe e permissões"
  },
  {
    title: "Segurança",
    icon: Shield,
    href: "/seguranca",
    description: "Configurações"
  },
  {
    title: "Aquecimento",
    icon: Activity,
    href: "/aquecimento",
    description: "Preparar números"
  },
  {
    title: "Links de Grupos",
    icon: LinkIcon,
    href: "/links",
    description: "Gestão de grupos"
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sidebar-foreground">WhatsManager</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-sidebar-accent"
            >
              <Menu className="h-5 w-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border" 
                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70"
                  )} />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-sidebar-foreground/60 font-normal">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-accent-foreground">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">João Silva</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">joao@empresa.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
