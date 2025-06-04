
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useResponsibles } from '@/hooks/useResponsibles';
import { useWhatsNumbers } from '@/hooks/useWhatsNumbers';
import { useGroups } from '@/hooks/useGroups';
import type { Tables } from '@/integrations/supabase/types';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Project = Tables<'projects'>;
export type WhatsNumber = Tables<'whats_numbers'>;
export type Group = Tables<'groups'>;
export type Responsible = Tables<'responsibles'>;

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  
  // Projects
  projects: Project[];
  addProject: (project: { name: string; description?: string }) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Numbers
  numbers: WhatsNumber[];
  addNumber: (numberData: {
    number: string;
    project_id: string;
    responsible_id: string;
    device: string;
    status: string;
  }) => Promise<WhatsNumber | null>;
  updateNumber: (id: string, updates: Partial<WhatsNumber>) => Promise<void>;
  deleteNumber: (id: string) => Promise<void>;
  
  // Groups
  groups: Group[];
  addGroup: (group: { name: string; url: string }) => Promise<Group | null>;
  updateGroup: (id: string, updates: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  
  // Responsibles
  responsibles: Responsible[];
  addResponsible: (responsible: { name: string; email?: string }) => Promise<Responsible | null>;
  updateResponsible: (id: string, updates: Partial<Responsible>) => Promise<void>;
  deleteResponsible: (id: string) => Promise<void>;
  
  // Loading states
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const userId = auth.user?.id;
  
  const projects = useProjects(userId);
  const responsibles = useResponsibles(userId);
  const numbers = useWhatsNumbers(userId);
  const groups = useGroups(userId);

  const currentUser = auth.user ? {
    id: auth.user.id,
    name: auth.user.user_metadata?.name || auth.user.email || '',
    email: auth.user.email || '',
  } : null;

  const contextValue: AppContextType = {
    // Auth
    currentUser,
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
    
    // Projects
    projects: projects.projects,
    addProject: projects.addProject,
    updateProject: projects.updateProject,
    deleteProject: projects.deleteProject,
    
    // Numbers
    numbers: numbers.numbers,
    addNumber: numbers.addNumber,
    updateNumber: numbers.updateNumber,
    deleteNumber: numbers.deleteNumber,
    
    // Groups
    groups: groups.groups,
    addGroup: groups.addGroup,
    updateGroup: groups.updateGroup,
    deleteGroup: groups.deleteGroup,
    
    // Responsibles
    responsibles: responsibles.responsibles,
    addResponsible: responsibles.addResponsible,
    updateResponsible: responsibles.updateResponsible,
    deleteResponsible: responsibles.deleteResponsible,
    
    // Loading
    loading: auth.loading || projects.loading || responsibles.loading || numbers.loading || groups.loading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
