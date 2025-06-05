
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Mail, 
  MessageSquare, 
  Lock, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { AddDeviceEmailModal } from './AddDeviceEmailModal';
import { useApp } from '@/contexts/AppContext';
import { useSecuritySettings } from '@/hooks/useSecuritySettings';

export const Seguranca = () => {
  const { currentUser } = useApp();
  const [showPin, setShowPin] = useState(false);
  const [isAddEmailModalOpen, setIsAddEmailModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  
  const {
    securityData,
    setSecurityData,
    deviceEmails,
    loading,
    saveSecuritySettings,
    addDeviceEmail,
    removeDeviceEmail
  } = useSecuritySettings(currentUser?.id);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePin = (pin: string) => {
    return pin.length >= 4 && pin.length <= 8;
  };

  const handleSaveSecurity = async () => {
    // Validações
    if (!securityData.email_recuperacao || !securityData.mensagem_recuperacao || !pin) {
      return;
    }

    if (!validateEmail(securityData.email_recuperacao)) {
      return;
    }

    if (!validatePin(pin)) {
      return;
    }

    const success = await saveSecuritySettings({
      ...securityData,
      codigo_pin: pin
    });

    if (success) {
      setPin(''); // Clear PIN after saving
    }
  };

  const handleAddDeviceEmail = async (email: string) => {
    await addDeviceEmail(email);
  };

  const handleRemoveDeviceEmail = async (emailToRemove: string) => {
    await removeDeviceEmail(emailToRemove);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Segurança</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações de segurança e recuperação de conta
          </p>
        </div>
      </div>

      {/* Formulário de Segurança Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Informações de Recuperação</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* E-mail de Recuperação */}
          <div className="space-y-2">
            <Label htmlFor="recovery-email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>E-mail de Recuperação</span>
            </Label>
            <Input
              id="recovery-email"
              type="email"
              placeholder="seu-email-de-recuperacao@exemplo.com"
              value={securityData.email_recuperacao}
              onChange={(e) => setSecurityData(prev => ({ ...prev, email_recuperacao: e.target.value }))}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              E-mail alternativo usado exclusivamente para recuperação de acesso
            </p>
          </div>

          {/* Mensagem de Recuperação */}
          <div className="space-y-2">
            <Label htmlFor="recovery-message" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Mensagem de Recuperação</span>
            </Label>
            <Textarea
              id="recovery-message"
              placeholder="Digite uma frase de segurança ou código mnemônico..."
              value={securityData.mensagem_recuperacao}
              onChange={(e) => setSecurityData(prev => ({ ...prev, mensagem_recuperacao: e.target.value }))}
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Frase de segurança para verificação extra durante a recuperação
            </p>
          </div>

          {/* Código PIN */}
          <div className="space-y-2">
            <Label htmlFor="pin" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Código PIN</span>
            </Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                placeholder="Digite seu PIN (4-8 caracteres)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pr-10"
                maxLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              PIN numérico ou alfanumérico para verificação adicional
            </p>
          </div>

          <Button 
            onClick={handleSaveSecurity} 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Informações de Segurança'}
          </Button>
        </CardContent>
      </Card>

      {/* E-mails de Dispositivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>E-mails de Dispositivos</span>
            </div>
            <Button
              onClick={() => setIsAddEmailModalOpen(true)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar E-mail</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            E-mails vinculados a dispositivos autorizados para monitoramento e alertas
          </p>
          
          {deviceEmails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum e-mail de dispositivo cadastrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deviceEmails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{email}</span>
                    <Badge variant="secondary" className="text-xs">
                      Autorizado
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDeviceEmail(email)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddDeviceEmailModal
        isOpen={isAddEmailModalOpen}
        onClose={() => setIsAddEmailModalOpen(false)}
        onAddEmail={handleAddDeviceEmail}
      />
    </div>
  );
};
