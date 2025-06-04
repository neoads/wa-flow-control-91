
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "João Silva"
    },
    {
      id: 2,
      name: "Maria Santos"
    },
    {
      id: 3,
      name: "Pedro Costa"
    },
    {
      id: 4,
      name: "Ana Oliveira"
    },
    {
      id: 5,
      name: "Carlos Lima"
    }
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (newUser: any) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleEditUser = (id: number, updatedUser: any) => {
    setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Usuários Responsáveis</h1>
          <p className="text-muted-foreground">Gerencie os responsáveis que serão vinculados aos números WhatsApp</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Search */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuário..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-foreground flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Lista de Usuários ({filteredUsers.length})
            </span>
            <Badge variant="secondary">{filteredUsers.length} de {users.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nome</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Users className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditUser={handleEditUser}
        user={selectedUser}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedUser && handleDeleteUser(selectedUser.id)}
        numberToDelete={selectedUser?.name || ''}
      />
    </div>
  );
};
