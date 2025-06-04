
import React, { useState, useEffect } from 'react';
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
import type { Project, Responsible, WhatsNumber } from '@/contexts/AppContext';

interface EditNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  number: WhatsNumber | null;
  projects: Project[];
  users: Responsible[];
}

export const EditNumberModal = ({ 
  isOpen, 
  onClose, 
  number,
  projects = [],
  users = []
}: EditNumberModalProps) => {
  const { updateNumber } = useApp();
  const [formData, setFormData] = useState({
    number: '',
    project_id: '',
    responsible_id: '',
    device: '',
    status: 'Ativo',
    url: ''
  });

  useEffect(() => {
    if (number) {
      setFormData({
        number: number.number || '',
        project_id: number.project_id || '',
        responsible_id: number.responsible_id || '',
        device: number.device || '',
        status: number.status || 'Ativo',
        url: number.url || ''
      });
    }
  }, [number]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.project_id || !formData.responsible_id || !formData.device) {
      return;
    }

    if (!number) return;

    await updateNumber(number.id, {
      number: formData.number,
      project_id: formData.project_id,
      responsible_id: formData.responsible_id,
      device: formData.device,
      status: formData.status,
      url: formData.url || `https://web.whatsapp.com/send?phone=${formData.number}`
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Número</DialogTitle>
          <DialogDescription>
            Atualize as informações do número WhatsApp.
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
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
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
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="Aquecendo">Aquecendo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
