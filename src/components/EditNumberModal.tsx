
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
import { useToast } from '@/hooks/use-toast';

interface EditNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditNumber: (id: number, numberData: any) => void;
  number: any;
  projects?: Array<{id: number, name: string}>;
  users?: Array<{id: number, name: string}>;
}

export const EditNumberModal = ({ 
  isOpen, 
  onClose, 
  onEditNumber, 
  number,
  projects = [],
  users = []
}: EditNumberModalProps) => {
  const [formData, setFormData] = useState({
    number: '',
    project: '',
    responsible: '',
    device: '',
    status: 'Ativo'
  });
  const { toast } = useToast();

  useEffect(() => {
    if (number) {
      setFormData({
        number: number.number || '',
        project: number.project || '',
        responsible: number.responsible || '',
        device: number.device || '',
        status: number.status || 'Ativo'
      });
    }
  }, [number]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.project || !formData.responsible || !formData.device) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validação do número
    if (!formData.number.startsWith('+55')) {
      toast({
        title: "Erro",
        description: "O número deve começar com +55.",
        variant: "destructive",
      });
      return;
    }

    onEditNumber(number.id, {
      ...number,
      number: formData.number,
      status: formData.status,
      project: formData.project,
      responsible: formData.responsible,
      device: formData.device
    });
    
    toast({
      title: "Sucesso!",
      description: "Número atualizado com sucesso.",
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
            <Select value={formData.project} onValueChange={(value) => handleInputChange('project', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável *</Label>
            <Select value={formData.responsible} onValueChange={(value) => handleInputChange('responsible', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
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
