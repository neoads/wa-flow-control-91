
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  PhoneOff,
  Activity,
  Clock,
  Edit,
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddNumberModal } from './AddNumberModal';
import { EditNumberModal } from './EditNumberModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { NumberDetailsModal } from './NumberDetailsModal';

export const Numeros = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<any>(null);
  
  const filters = ['Todos', 'Ativo', 'Inativo', 'Suspenso', 'API', 'Aquecendo'];
  
  // Mock data para projetos e usuários (em um app real, isso viria de contexto/API)
  const mockProjects = [
    { id: 1, name: "Projeto Alpha" },
    { id: 2, name: "Projeto Beta" },
    { id: 3, name: "Projeto Gamma" },
    { id: 4, name: "Projeto Delta" },
    { id: 5, name: "Projeto Epsilon" }
  ];

  const mockUsers = [
    { id: 1, name: "João Silva" },
    { id: 2, name: "Maria Santos" },
    { id: 3, name: "Pedro Costa" },
    { id: 4, name: "Ana Oliveira" },
    { id: 5, name: "Carlos Lima" }
  ];
  
  // Mock data com projetos e responsáveis atualizados
  const [numbers, setNumbers] = useState([
    {
      id: 1,
      number: "+55 11 99999-0001",
      status: "Ativo",
      project: "Projeto Alpha",
      responsible: "João Silva",
      device: "Celular",
      lastActivity: "2h",
      messages: 1247
    },
    {
      id: 2,
      number: "+55 11 99999-0002",
      status: "API",
      project: "Projeto Beta",
      responsible: "Maria Santos",
      device: "Emulador",
      lastActivity: "5min",
      messages: 3421
    },
    {
      id: 3,
      number: "+55 11 99999-0003",
      status: "Aquecendo",
      project: "Projeto Gamma",
      responsible: "Pedro Costa",
      device: "Celular",
      lastActivity: "1h",
      messages: 45
    },
    {
      id: 4,
      number: "+55 11 99999-0004",
      status: "Suspenso",
      project: "Projeto Delta",
      responsible: "Ana Oliveira",
      device: "Emulador",
      lastActivity: "2d",
      messages: 0
    },
    {
      id: 5,
      number: "+55 11 99999-0005",
      status: "Inativo",
      project: "Projeto Epsilon",
      responsible: "Carlos Lima",
      device: "Celular",
      lastActivity: "1d",
      messages: 892
    }
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Ativo": 
        return { 
          color: "bg-green-500/20 text-green-400 border border-green-500/30", 
          icon: Phone,
          iconColor: "text-green-400"
        };
      case "API": 
        return { 
          color: "bg-blue-500/20 text-blue-400 border border-blue-500/30", 
          icon: Activity,
          iconColor: "text-blue-400"
        };
      case "Aquecendo": 
        return { 
          color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30", 
          icon: Clock,
          iconColor: "text-yellow-400"
        };
      case "Suspenso": 
        return { 
          color: "bg-orange-500/20 text-orange-400 border border-orange-500/30", 
          icon: AlertTriangle,
          iconColor: "text-orange-400"
        };
      case "Inativo": 
        return { 
          color: "bg-gray-500/20 text-gray-400 border border-gray-500/30", 
          icon: PhoneOff,
          iconColor: "text-gray-400"
        };
      default: 
        return { 
          color: "bg-gray-500/20 text-gray-400 border border-gray-500/30", 
          icon: Phone,
          iconColor: "text-gray-400"
        };
    }
  };

  const filteredNumbers = numbers.filter(num => {
    const matchesFilter = activeFilter === 'Todos' || num.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      num.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      num.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      num.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddNumber = (newNumber: any) => {
    setNumbers(prev => [...prev, newNumber]);
  };

  const handleEditNumber = (id: number, updatedNumber: any) => {
    setNumbers(prev => prev.map(num => num.id === id ? updatedNumber : num));
  };

  const handleDeleteNumber = (id: number) => {
    setNumbers(prev => prev.filter(num => num.id !== id));
  };

  const openEditModal = (number: any) => {
    setSelectedNumber(number);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (number: any) => {
    setSelectedNumber(number);
    setIsDeleteModalOpen(true);
  };

  const openDetailsModal = (number: any) => {
    setSelectedNumber(number);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Números WhatsApp</h1>
          <p className="text-muted-foreground">Gerencie todos os números da sua operação</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Número
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={activeFilter === filter ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {filter}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar número..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numbers Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-foreground">Lista de Números ({filteredNumbers.length})</span>
            <Badge variant="secondary">{filteredNumbers.length} de {numbers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Número</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Projeto</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Responsável</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Dispositivo</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mensagens</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Última Atividade</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredNumbers.map((number) => {
                  const statusInfo = getStatusInfo(number.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={number.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">{number.number}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`h-4 w-4 ${statusInfo.iconColor}`} />
                          <Badge className={statusInfo.color}>{number.status}</Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">{number.project}</td>
                      <td className="py-4 px-4 text-foreground">{number.responsible}</td>
                      <td className="py-4 px-4 text-muted-foreground">{number.device}</td>
                      <td className="py-4 px-4 text-foreground font-medium">{number.messages.toLocaleString()}</td>
                      <td className="py-4 px-4 text-muted-foreground">{number.lastActivity}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDetailsModal(number)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditModal(number)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDeleteModal(number)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => openDetailsModal(number)}>
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditModal(number)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteModal(number)}
                                className="text-red-600"
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddNumberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNumber={handleAddNumber}
        projects={mockProjects}
        users={mockUsers}
      />

      <EditNumberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditNumber={handleEditNumber}
        number={selectedNumber}
        projects={mockProjects}
        users={mockUsers}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedNumber && handleDeleteNumber(selectedNumber.id)}
        numberToDelete={selectedNumber?.number || ''}
      />

      <NumberDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        number={selectedNumber}
      />
    </div>
  );
};
