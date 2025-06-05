
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjects } from '@/hooks/useProjects';
import { useApp } from '@/contexts/AppContext';

interface AddDeviceEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmail: (email: string, projectId?: string) => void;
}

export const AddDeviceEmailModal = ({
  isOpen,
  onClose,
  onAddEmail
}: AddDeviceEmailModalProps) => {
  const { currentUser } = useApp();
  const { projects } = useProjects(currentUser?.id);
  const [email, setEmail] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAdd = () => {
    if (email && validateEmail(email)) {
      onAddEmail(email, selectedProject || undefined);
      setEmail('');
      setSelectedProject('');
      onClose();
    }
  };

  const handleClose = () => {
    setEmail('');
    setSelectedProject('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar E-mail de Dispositivo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="device-email">E-mail do Dispositivo</Label>
            <Input
              id="device-email"
              type="email"
              placeholder="dispositivo@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="project-select">Projeto (Opcional)</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum projeto</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Vincule este e-mail a um projeto específico
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAdd} 
              disabled={!email || !validateEmail(email)}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
