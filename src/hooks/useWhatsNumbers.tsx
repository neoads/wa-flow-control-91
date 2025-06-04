
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type WhatsNumber = Tables<'whats_numbers'>;

export const useWhatsNumbers = (userId?: string) => {
  const [numbers, setNumbers] = useState<WhatsNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNumbers = async () => {
    if (!userId) {
      setNumbers([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('whats_numbers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNumbers(data || []);
    } catch (error) {
      console.error('Erro ao buscar números:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os números",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, [userId]);

  const addNumber = async (numberData: {
    number: string;
    project_id: string;
    responsible_id: string;
    device: string;
    status: string;
  }) => {
    if (!userId) return null;

    try {
      const cleanNumber = numberData.number.replace(/\D/g, '');
      const formattedNumber = numberData.number.startsWith('+55') ? numberData.number : `+55${cleanNumber}`;
      
      const { data, error } = await supabase
        .from('whats_numbers')
        .insert({
          ...numberData,
          number: formattedNumber,
          url: `https://wa.me/${cleanNumber}`,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      setNumbers(prev => [data, ...prev]);
      toast({
        title: "Sucesso!",
        description: "Número adicionado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar número:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o número",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateNumber = async (id: string, updates: Partial<WhatsNumber>) => {
    try {
      const { error } = await supabase
        .from('whats_numbers')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setNumbers(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
      toast({
        title: "Sucesso!",
        description: "Número atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar número:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o número",
        variant: "destructive",
      });
    }
  };

  const deleteNumber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('whats_numbers')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setNumbers(prev => prev.filter(n => n.id !== id));
      toast({
        title: "Sucesso!",
        description: "Número removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar número:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o número",
        variant: "destructive",
      });
    }
  };

  return {
    numbers,
    loading,
    addNumber,
    updateNumber,
    deleteNumber,
    refetch: fetchNumbers,
  };
};
