
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WarmingNumber {
  id: string;
  numero: string;
  descricao: string | null;
  url: string;
  created_at: string;
}

export interface WarmingGroup {
  id: string;
  nome: string;
  url: string;
  created_at: string;
}

export const useWarmingData = (userId: string | undefined) => {
  const [warmingNumbers, setWarmingNumbers] = useState<WarmingNumber[]>([]);
  const [warmingGroups, setWarmingGroups] = useState<WarmingGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load warming data
  const loadWarmingData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Load warming numbers
      const { data: numbers } = await supabase
        .from('warming_numbers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (numbers) {
        setWarmingNumbers(numbers);
      }

      // Load warming groups
      const { data: groups } = await supabase
        .from('warming_groups')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (groups) {
        setWarmingGroups(groups);
      }
    } catch (error) {
      console.error('Error loading warming data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save warming numbers
  const saveWarmingNumbers = async (numbersText: string) => {
    if (!userId || !numbersText.trim()) return false;

    try {
      const lines = numbersText.trim().split('\n');
      const numbersToInsert = [];
      
      for (const line of lines) {
        const parts = line.split('|');
        const numero = parts[0]?.trim();
        const descricao = parts[1]?.trim() || null;
        
        if (numero && numero.startsWith('+55')) {
          // Remove +55 from number for URL generation
          const urlNumber = numero.replace('+', '');
          
          numbersToInsert.push({
            user_id: userId,
            numero,
            descricao,
            url: `https://wa.me/${urlNumber}`
          });
        }
      }

      if (numbersToInsert.length === 0) {
        toast({
          title: "Nenhum Número Válido",
          description: "Nenhum número válido foi encontrado para salvar.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('warming_numbers')
        .insert(numbersToInsert);

      if (error) {
        console.error('Error saving warming numbers:', error);
        toast({
          title: "Erro",
          description: "Alguns números podem já estar cadastrados.",
          variant: "destructive"
        });
        return false;
      }

      await loadWarmingData(); // Reload data
      toast({
        title: "Sucesso!",
        description: `${numbersToInsert.length} números de aquecimento salvos.`,
      });

      return true;
    } catch (error) {
      console.error('Error saving warming numbers:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os números.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Save warming groups
  const saveWarmingGroups = async (groupsText: string) => {
    if (!userId || !groupsText.trim()) return false;

    try {
      const lines = groupsText.trim().split('\n');
      const groupsToInsert = [];
      
      for (const line of lines) {
        const parts = line.split('|');
        const nome = parts[0]?.trim();
        const url = parts[1]?.trim();
        
        if (nome && url && url.includes('chat.whatsapp.com')) {
          groupsToInsert.push({
            user_id: userId,
            nome,
            url
          });
        }
      }

      if (groupsToInsert.length === 0) {
        toast({
          title: "Nenhum Grupo Válido",
          description: "Nenhum grupo válido foi encontrado para salvar.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('warming_groups')
        .insert(groupsToInsert);

      if (error) {
        console.error('Error saving warming groups:', error);
        toast({
          title: "Erro",
          description: "Alguns grupos podem já estar cadastrados.",
          variant: "destructive"
        });
        return false;
      }

      await loadWarmingData(); // Reload data
      toast({
        title: "Sucesso!",
        description: `${groupsToInsert.length} grupos salvos.`,
      });

      return true;
    } catch (error) {
      console.error('Error saving warming groups:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os grupos.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete warming number
  const deleteWarmingNumber = async (id: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('warming_numbers')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setWarmingNumbers(prev => prev.filter(num => num.id !== id));
      toast({
        title: "Removido",
        description: "Número de aquecimento removido.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting warming number:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o número.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete warming group
  const deleteWarmingGroup = async (id: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('warming_groups')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setWarmingGroups(prev => prev.filter(group => group.id !== id));
      toast({
        title: "Removido",
        description: "Grupo removido.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting warming group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o grupo.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadWarmingData();
  }, [userId]);

  return {
    warmingNumbers,
    warmingGroups,
    loading,
    saveWarmingNumbers,
    saveWarmingGroups,
    deleteWarmingNumber,
    deleteWarmingGroup,
    loadWarmingData
  };
};
