
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

interface SecurityConfiguration {
  id: string;
  configuration_name: string;
  email_recuperacao: string;
  mensagem_recuperacao: string;
  created_at: string;
  updated_at: string;
}

interface DeviceEmail {
  id: string;
  email: string;
  project_id: string | null;
  project?: {
    name: string;
  };
}

export const useSecuritySettings = (userId: string | undefined) => {
  const [securityData, setSecurityData] = useState({
    email_recuperacao: '',
    mensagem_recuperacao: '',
    codigo_pin: ''
  });
  const [deviceEmails, setDeviceEmails] = useState<DeviceEmail[]>([]);
  const [configurations, setConfigurations] = useState<SecurityConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load security configurations
  const loadSecurityConfigurations = async () => {
    if (!userId) return;
    
    try {
      const { data: configs } = await supabase
        .from('security_settings')
        .select('id, configuration_name, email_recuperacao, mensagem_recuperacao, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (configs) {
        setConfigurations(configs);
      }
    } catch (error) {
      console.error('Error loading security configurations:', error);
    }
  };

  // Load device emails with project information
  const loadDeviceEmails = async () => {
    if (!userId) return;
    
    try {
      const { data: emails } = await supabase
        .from('device_emails')
        .select(`
          id,
          email,
          project_id,
          projects (
            name
          )
        `)
        .eq('user_id', userId);

      if (emails) {
        setDeviceEmails(emails.map(item => ({
          id: item.id,
          email: item.email,
          project_id: item.project_id,
          project: item.projects ? { name: item.projects.name } : undefined
        })));
      }
    } catch (error) {
      console.error('Error loading device emails:', error);
    }
  };

  // Save security configuration with name
  const saveSecurityConfiguration = async (data: {
    email_recuperacao: string;
    mensagem_recuperacao: string;
    codigo_pin: string;
  }, configurationName: string) => {
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
          configuration_name: configurationName,
          email_recuperacao: data.email_recuperacao,
          mensagem_recuperacao: data.mensagem_recuperacao,
          codigo_pin: hashedPin,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Configuração Salva",
        description: `A configuração "${configurationName}" foi salva com sucesso.`,
      });

      await loadSecurityConfigurations();
      return true;
    } catch (error) {
      console.error('Error saving security configuration:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração de segurança.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Load specific configuration
  const loadConfiguration = (config: SecurityConfiguration) => {
    setSecurityData({
      email_recuperacao: config.email_recuperacao || '',
      mensagem_recuperacao: config.mensagem_recuperacao || '',
      codigo_pin: '' // Never load the PIN for security
    });

    toast({
      title: "Configuração Carregada",
      description: `A configuração "${config.configuration_name}" foi carregada.`,
    });
  };

  // Delete configuration
  const deleteConfiguration = async (configId: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('security_settings')
        .delete()
        .eq('id', configId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Configuração Removida",
        description: "A configuração foi removida com sucesso.",
      });

      await loadSecurityConfigurations();
      return true;
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a configuração.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Add device email with optional project
  const addDeviceEmail = async (email: string, projectId?: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('device_emails')
        .insert({
          user_id: userId,
          email: email,
          project_id: projectId || null
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "E-mail Duplicado",
            description: "Este e-mail já está cadastrado.",
            variant: "destructive"
          });
          return false;
        }
        throw error;
      }

      toast({
        title: "E-mail Adicionado",
        description: `O e-mail ${email} foi adicionado com sucesso.`,
      });

      await loadDeviceEmails();
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
  const removeDeviceEmail = async (emailId: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('device_emails')
        .delete()
        .eq('id', emailId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "E-mail Removido",
        description: "O e-mail foi removido com sucesso.",
      });

      await loadDeviceEmails();
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
    if (userId) {
      loadSecurityConfigurations();
      loadDeviceEmails();
    }
  }, [userId]);

  return {
    securityData,
    setSecurityData,
    deviceEmails,
    configurations,
    loading,
    saveSecurityConfiguration,
    loadConfiguration,
    deleteConfiguration,
    addDeviceEmail,
    removeDeviceEmail,
    loadSecurityConfigurations,
    loadDeviceEmails
  };
};
