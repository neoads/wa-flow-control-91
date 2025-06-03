
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
}

export const EditNumberModal = ({ isOpen, onClose, onEditNumber, number }: EditNumberModalProps) => {
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
    
    if (!formData.number || !formData.project || !formData.responsible) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
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
      device: formData.device || 'Não informado'
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
            <Input
              id="project"
              placeholder="Nome do projeto"
              value={formData.project}
              onChange={(e) => handleInputChange('project', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável *</Label>
            <Input
              id="responsible"
              placeholder="Nome do responsável"
              value={formData.responsible}
              onChange={(e) => handleInputChange('responsible', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="device">Dispositivo</Label>
            <Input
              id="device"
              placeholder="iPhone 14, Android S23, etc."
              value={formData.device}
              onChange={(e) => handleInputChange('device', e.target.value)}
              className="w-full"
            />
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
                <SelectItem value="Banido">Banido</SelectItem>
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
