
import React, { useState, useEffect } from 'react';
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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (id: number, user: any) => void;
  user: any;
}

export const EditUserModal = ({ isOpen, onClose, onEditUser, user }: EditUserModalProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

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

    const updatedUser = {
      ...user,
      name: name.trim()
    };

    onEditUser(user.id, updatedUser);
    onClose();
  };

  const handleClose = () => {
    setName(user?.name || '');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Editar Usuário</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-user-name">Nome do Usuário</Label>
            <Input
              id="edit-user-name"
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Atualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
