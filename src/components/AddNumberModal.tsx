
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useApp } from '@/contexts/AppContext';

interface AddNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddNumberModal = ({ isOpen, onClose }: AddNumberModalProps) => {
  const { projects, responsibles, addNumber } = useApp();
  const [formData, setFormData] = useState({
    number: '',
    project_id: '',
    responsible_id: '',
    device: '',
    status: 'Aquecendo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.project_id || !formData.responsible_id || !formData.device) {
      return;
    }

    const success = await addNumber(formData);
    if (success) {
      setFormData({
        number: '',
        project_id: '',
        responsible_id: '',
        device: '',
        status: 'Aquecendo'
      });
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Número</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo número WhatsApp.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número WhatsApp *</Label>
            <Input
              id="number"
              placeholder="+55 11 99999-0000"
              value={formData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Projeto *</Label>
            <Select value={formData.project_id} onValueChange={(value) => handleInputChange('project_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável *</Label>
            <Select value={formData.responsible_id} onValueChange={(value) => handleInputChange('responsible_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {responsibles.map((responsible) => (
                  <SelectItem key={responsible.id} value={responsible.id}>
                    {responsible.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device">Dispositivo *</Label>
            <Select value={formData.device} onValueChange={(value) => handleInputChange('device', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Celular">Celular</SelectItem>
                <SelectItem value="Emulador">Emulador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status Inicial</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aquecendo">Aquecendo</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Adicionar Número
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
