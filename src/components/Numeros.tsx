
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
  Trash2
} from 'lucide-react';

export const Numeros = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  
  const filters = ['Todos', 'Ativo', 'Inativo', 'Banido', 'API', 'Aquecendo'];
  
  const numbers = [
    {
      id: 1,
      number: "+55 11 99999-0001",
      status: "Ativo",
      project: "Projeto Alpha",
      responsible: "João Silva",
      device: "iPhone 12",
      lastActivity: "2h",
      messages: 1247
    },
    {
      id: 2,
      number: "+55 11 99999-0002",
      status: "API",
      project: "Projeto Beta",
      responsible: "Maria Santos",
      device: "Android S21",
      lastActivity: "5min",
      messages: 3421
    },
    {
      id: 3,
      number: "+55 11 99999-0003",
      status: "Aquecendo",
      project: "Projeto Gamma",
      responsible: "Pedro Costa",
      device: "iPhone 13",
      lastActivity: "1h",
      messages: 45
    },
    {
      id: 4,
      number: "+55 11 99999-0004",
      status: "Banido",
      project: "Projeto Delta",
      responsible: "Ana Oliveira",
      device: "Android Pixel",
      lastActivity: "2d",
      messages: 0
    },
    {
      id: 5,
      number: "+55 11 99999-0005",
      status: "Inativo",
      project: "Projeto Epsilon",
      responsible: "Carlos Lima",
      device: "iPhone 14",
      lastActivity: "1d",
      messages: 892
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Ativo": 
        return { 
          color: "bg-green-100 text-green-800", 
          icon: Phone,
          iconColor: "text-green-600"
        };
      case "API": 
        return { 
          color: "bg-blue-100 text-blue-800", 
          icon: Activity,
          iconColor: "text-blue-600"
        };
      case "Aquecendo": 
        return { 
          color: "bg-yellow-100 text-yellow-800", 
          icon: Clock,
          iconColor: "text-yellow-600"
        };
      case "Banido": 
        return { 
          color: "bg-red-100 text-red-800", 
          icon: PhoneOff,
          iconColor: "text-red-600"
        };
      case "Inativo": 
        return { 
          color: "bg-gray-100 text-gray-800", 
          icon: PhoneOff,
          iconColor: "text-gray-600"
        };
      default: 
        return { 
          color: "bg-gray-100 text-gray-800", 
          icon: Phone,
          iconColor: "text-gray-600"
        };
    }
  };

  const filteredNumbers = activeFilter === 'Todos' 
    ? numbers 
    : numbers.filter(num => num.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Números WhatsApp</h1>
          <p className="text-gray-600">Gerencie todos os números da sua operação</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Número
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar número..."
                  className="pl-10 w-64"
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Números ({filteredNumbers.length})</span>
            <Badge variant="secondary">{filteredNumbers.length} de {numbers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Número</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Projeto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Responsável</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Dispositivo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Mensagens</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Última Atividade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredNumbers.map((number) => {
                  const statusInfo = getStatusInfo(number.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={number.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gray-100`}>
                            <Phone className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium text-gray-900">{number.number}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`h-4 w-4 ${statusInfo.iconColor}`} />
                          <Badge className={statusInfo.color}>{number.status}</Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{number.project}</td>
                      <td className="py-4 px-4 text-gray-900">{number.responsible}</td>
                      <td className="py-4 px-4 text-gray-600">{number.device}</td>
                      <td className="py-4 px-4 text-gray-900 font-medium">{number.messages.toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-600">{number.lastActivity}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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
    </div>
  );
};
