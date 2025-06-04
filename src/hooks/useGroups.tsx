
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Group = Tables<'groups'>;

export const useGroups = (userId?: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGroups = async () => {
    if (!userId) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os grupos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  const addGroup = async (group: { name: string; url: string }) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('groups')
        .insert({
          ...group,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      setGroups(prev => [data, ...prev]);
      toast({
        title: "Sucesso!",
        description: "Grupo adicionado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar grupo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o grupo",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateGroup = async (id: string, updates: Partial<Group>) => {
    try {
      const { error } = await supabase
        .from('groups')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
      toast({
        title: "Sucesso!",
        description: "Grupo atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o grupo",
        variant: "destructive",
      });
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setGroups(prev => prev.filter(g => g.id !== id));
      toast({
        title: "Sucesso!",
        description: "Grupo removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o grupo",
        variant: "destructive",
      });
    }
  };

  return {
    groups,
    loading,
    addGroup,
    updateGroup,
    deleteGroup,
    refetch: fetchGroups,
  };
};
