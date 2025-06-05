
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

export const useSecuritySettings = (userId: string | undefined) => {
  const [securityData, setSecurityData] = useState({
    email_recuperacao: '',
    mensagem_recuperacao: '',
    codigo_pin: ''
  });
  const [deviceEmails, setDeviceEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load security settings
  const loadSecuritySettings = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Load security settings
      const { data: settings } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (settings) {
        setSecurityData({
          email_recuperacao: settings.email_recuperacao || '',
          mensagem_recuperacao: settings.mensagem_recuperacao || '',
          codigo_pin: '' // Never load the PIN for security
        });
      }

      // Load device emails
      const { data: emails } = await supabase
        .from('device_emails')
        .select('email')
        .eq('user_id', userId);

      if (emails) {
        setDeviceEmails(emails.map(item => item.email));
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save security settings
  const saveSecuritySettings = async (data: {
    email_recuperacao: string;
    mensagem_recuperacao: string;
    codigo_pin: string;
  }) => {
    if (!userId) return false;

    try {
      // Hash the PIN if provided
      let hashedPin = null;
      if (data.codigo_pin) {
        hashedPin = await bcrypt.hash(data.codigo_pin, 10);
      }

      const { error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: userId,
          email_recuperacao: data.email_recuperacao,
          mensagem_recuperacao: data.mensagem_recuperacao,
          codigo_pin: hashedPin,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Dados de Segurança Salvos",
        description: "Suas informações de segurança foram atualizadas com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações de segurança.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Add device email
  const addDeviceEmail = async (email: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('device_emails')
        .insert({
          user_id: userId,
          email: email
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "E-mail Duplicado",
            description: "Este e-mail já está cadastrado.",
            variant: "destructive"
          });
          return false;
        }
        throw error;
      }

      setDeviceEmails(prev => [...prev, email]);
      toast({
        title: "E-mail Adicionado",
        description: `O e-mail ${email} foi adicionado com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error('Error adding device email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o e-mail.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Remove device email
  const removeDeviceEmail = async (email: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('device_emails')
        .delete()
        .eq('user_id', userId)
        .eq('email', email);

      if (error) throw error;

      setDeviceEmails(prev => prev.filter(e => e !== email));
      toast({
        title: "E-mail Removido",
        description: `O e-mail ${email} foi removido.`,
      });

      return true;
    } catch (error) {
      console.error('Error removing device email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o e-mail.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadSecuritySettings();
  }, [userId]);

  return {
    securityData,
    setSecurityData,
    deviceEmails,
    loading,
    saveSecuritySettings,
    addDeviceEmail,
    removeDeviceEmail,
    loadSecuritySettings
  };
};
