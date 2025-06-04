
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FolderOpen } from 'lucide-react';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProject: (id: number, project: any) => void;
  project: any;
}

export const EditProjectModal = ({ isOpen, onClose, onEditProject, project }: EditProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
    }
  }, [project]);

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

    const updatedProject = {
      ...project,
      name: name.trim(),
      description: description.trim()
    };

    onEditProject(project.id, updatedProject);
    onClose();
  };

  const handleClose = () => {
    setName(project?.name || '');
    setDescription(project?.description || '');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <span>Editar Projeto</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project-name">Nome do Projeto</Label>
            <Input
              id="edit-project-name"
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
            <Label htmlFor="edit-project-description">Descrição (opcional)</Label>
            <Textarea
              id="edit-project-description"
              placeholder="Ex: Campanha de remarketing para leads do funil X"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
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
