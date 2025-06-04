
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;

export const useProjects = (userId?: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!userId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const addProject = async (project: { name: string; description?: string }) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      toast({
        title: "Sucesso!",
        description: "Projeto adicionado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o projeto",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      toast({
        title: "Sucesso!",
        description: "Projeto atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o projeto",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso!",
        description: "Projeto removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o projeto",
        variant: "destructive",
      });
    }
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
