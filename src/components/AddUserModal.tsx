
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
import { Users } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: any) => void;
}

export const AddUserModal = ({ isOpen, onClose, onAddUser }: AddUserModalProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!name.trim()) {
      setError('Por favor, insira um nome.');
      return;
    }

    if (name.trim().length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim()
    };

    onAddUser(newUser);
    setName('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Adicionar Usuário</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">Nome do Usuário</Label>
            <Input
              id="user-name"
              type="text"
              placeholder="Digite o nome do usuário"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            Este usuário poderá ser selecionado como responsável no cadastro de números WhatsApp.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
