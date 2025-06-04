
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface WhatsNumber {
  id: string;
  number: string;
  project: string;
  responsible: string;
  device: 'Celular' | 'Emulador';
  status: 'Ativo' | 'API' | 'Aquecendo' | 'Inativo' | 'Suspenso';
  url: string;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
}

export interface Responsible {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  numbers: WhatsNumber[];
  groups: Group[];
  responsibles: Responsible[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  addNumber: (number: Omit<WhatsNumber, 'id' | 'url' | 'createdAt'>) => void;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
  addResponsible: (responsible: Omit<Responsible, 'id'>) => void;
  updateNumber: (id: string, number: Partial<WhatsNumber>) => void;
  deleteNumber: (id: string) => void;
  deleteProject: (id: string) => void;
  deleteGroup: (id: string) => void;
  deleteResponsible: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  currentUser: null,
  users: [
    { id: '1', name: 'Admin', email: 'admin@test.com' }
  ],
  projects: [
    { id: '1', name: 'Campanha Black Friday', description: 'Promoções especiais', createdAt: new Date() },
    { id: '2', name: 'Lançamento VIP', description: 'Produtos exclusivos', createdAt: new Date() }
  ],
  numbers: [
    {
      id: '1',
      number: '+5511999999999',
      project: 'Campanha Black Friday',
      responsible: 'Admin',
      device: 'Celular',
      status: 'Ativo',
      url: 'https://wa.me/5511999999999',
      createdAt: new Date()
    },
    {
      id: '2',
      number: '+5511888888888',
      project: 'Lançamento VIP',
      responsible: 'Admin',
      device: 'Emulador',
      status: 'Aquecendo',
      url: 'https://wa.me/5511888888888',
      createdAt: new Date()
    }
  ],
  groups: [
    { id: '1', name: 'Grupo VIP Clientes', url: 'https://chat.whatsapp.com/example1', createdAt: new Date() },
    { id: '2', name: 'Suporte Técnico', url: 'https://chat.whatsapp.com/example2', createdAt: new Date() }
  ],
  responsibles: [
    { id: '1', name: 'Admin', email: 'admin@test.com' },
    { id: '2', name: 'João Silva', email: 'joao@empresa.com' },
    { id: '3', name: 'Maria Santos', email: 'maria@empresa.com' }
  ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('whatsManager_data');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('whatsManager_data', JSON.stringify(state));
  }, [state]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login - em produção seria uma chamada real à API
    const user = state.users.find(u => u.email === email);
    if (user && password === '123456') {
      setState(prev => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const userExists = state.users.some(u => u.email === email);
    if (userExists) return false;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email
    };

    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser
    }));
    return true;
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setState(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const addNumber = (number: Omit<WhatsNumber, 'id' | 'url' | 'createdAt'>) => {
    const cleanNumber = number.number.replace(/\D/g, '');
    const formattedNumber = `+55${cleanNumber}`;
    const newNumber: WhatsNumber = {
      ...number,
      number: formattedNumber,
      id: Date.now().toString(),
      url: `https://wa.me/${cleanNumber}`,
      createdAt: new Date()
    };
    setState(prev => ({ ...prev, numbers: [...prev.numbers, newNumber] }));
  };

  const addGroup = (group: Omit<Group, 'id' | 'createdAt'>) => {
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setState(prev => ({ ...prev, groups: [...prev.groups, newGroup] }));
  };

  const addResponsible = (responsible: Omit<Responsible, 'id'>) => {
    const newResponsible: Responsible = {
      ...responsible,
      id: Date.now().toString()
    };
    setState(prev => ({ ...prev, responsibles: [...prev.responsibles, newResponsible] }));
  };

  const updateNumber = (id: string, updates: Partial<WhatsNumber>) => {
    setState(prev => ({
      ...prev,
      numbers: prev.numbers.map(num => 
        num.id === id ? { ...num, ...updates } : num
      )
    }));
  };

  const deleteNumber = (id: string) => {
    setState(prev => ({
      ...prev,
      numbers: prev.numbers.filter(num => num.id !== id)
    }));
  };

  const deleteProject = (id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const deleteGroup = (id: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.filter(group => group.id !== id)
    }));
  };

  const deleteResponsible = (id: string) => {
    setState(prev => ({
      ...prev,
      responsibles: prev.responsibles.filter(resp => resp.id !== id)
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      logout,
      register,
      addProject,
      addNumber,
      addGroup,
      addResponsible,
      updateNumber,
      deleteNumber,
      deleteProject,
      deleteGroup,
      deleteResponsible
    }}>
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
