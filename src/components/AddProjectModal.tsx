
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FolderOpen } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: any) => void;
}

export const AddProjectModal = ({ isOpen, onClose, onAddProject }: AddProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!name.trim()) {
      setError('Por favor, insira o nome do projeto.');
      return;
    }

    if (name.trim().length < 2) {
      setError('O nome do projeto deve ter pelo menos 2 caracteres.');
      return;
    }

    const newProject = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim()
    };

    onAddProject(newProject);
    setName('');
    setDescription('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <span>Adicionar Projeto</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Nome do Projeto</Label>
            <Input
              id="project-name"
              type="text"
              placeholder="Ex: Campanha Black November"
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

          <div className="space-y-2">
            <Label htmlFor="project-description">Descrição (opcional)</Label>
            <Textarea
              id="project-description"
              placeholder="Ex: Campanha de remarketing para leads do funil X"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Este projeto poderá ser selecionado no cadastro de números WhatsApp.
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
