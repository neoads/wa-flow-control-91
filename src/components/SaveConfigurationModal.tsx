
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SaveConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (configName: string) => void;
  loading?: boolean;
}

export const SaveConfigurationModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false
}: SaveConfigurationModalProps) => {
  const [configName, setConfigName] = useState('');

  const handleSave = () => {
    if (configName.trim()) {
      onSave(configName.trim());
      setConfigName('');
    }
  };

  const handleClose = () => {
    setConfigName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Salvar Configuração de Segurança</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="config-name">Nome da Configuração</Label>
            <Input
              id="config-name"
              placeholder="Ex: Configuração Principal"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!configName.trim() || loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
