
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface AddDeviceEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmail: (email: string) => void;
}

export const AddDeviceEmailModal = ({ isOpen, onClose, onAddEmail }: AddDeviceEmailModalProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    setError('');

    if (!email.trim()) {
      setError('Por favor, insira um e-mail.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    onAddEmail(email.trim());
    setEmail('');
    onClose();
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Adicionar E-mail de Dispositivo</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="device-email">E-mail do Dispositivo</Label>
            <Input
              id="device-email"
              type="email"
              placeholder="colaborador@empresa.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            Este e-mail será usado para monitoramento e alertas de segurança
            quando o dispositivo for autorizado a acessar a conta.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Adicionar E-mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
