
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Responsible = Tables<'responsibles'>;

export const useResponsibles = (userId?: string) => {
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResponsibles = async () => {
    if (!userId) {
      setResponsibles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('responsibles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponsibles(data || []);
    } catch (error) {
      console.error('Erro ao buscar responsáveis:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os responsáveis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponsibles();
  }, [userId]);

  const addResponsible = async (responsible: { name: string; email?: string }) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('responsibles')
        .insert({
          ...responsible,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      setResponsibles(prev => [data, ...prev]);
      toast({
        title: "Sucesso!",
        description: "Responsável adicionado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar responsável:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o responsável",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateResponsible = async (id: string, updates: Partial<Responsible>) => {
    try {
      const { error } = await supabase
        .from('responsibles')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setResponsibles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      toast({
        title: "Sucesso!",
        description: "Responsável atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar responsável:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o responsável",
        variant: "destructive",
      });
    }
  };

  const deleteResponsible = async (id: string) => {
    try {
      const { error } = await supabase
        .from('responsibles')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setResponsibles(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Sucesso!",
        description: "Responsável removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar responsável:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o responsável",
        variant: "destructive",
      });
    }
  };

  return {
    responsibles,
    loading,
    addResponsible,
    updateResponsible,
    deleteResponsible,
    refetch: fetchResponsibles,
  };
};
