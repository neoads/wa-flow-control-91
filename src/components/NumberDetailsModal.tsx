
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  User, 
  Smartphone, 
  MessageSquare, 
  Clock, 
  FolderOpen 
} from 'lucide-react';

interface NumberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  number: any;
}

export const NumberDetailsModal = ({ isOpen, onClose, number }: NumberDetailsModalProps) => {
  if (!number) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "API": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "Aquecendo": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Banido": return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "Inativo": return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Detalhes do Número</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{number.number}</h3>
            <Badge className={getStatusColor(number.status)}>{number.status}</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>Projeto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground">{number.project}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Responsável</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground">{number.responsible}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Dispositivo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground">{number.device}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Mensagens</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-foreground">{number.messages.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Última Atividade</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-foreground">{number.lastActivity}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
