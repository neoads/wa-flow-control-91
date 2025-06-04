
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
  FolderOpen
} from 'lucide-react';
import { AddProjectModal } from './AddProjectModal';
import { EditProjectModal } from './EditProjectModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const Projetos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Projeto Alpha",
      description: "Projeto principal de vendas do trimestre"
    },
    {
      id: 2,
      name: "Projeto Beta",
      description: "Campanha de remarketing para leads qualificados"
    },
    {
      id: 3,
      name: "Projeto Gamma",
      description: "Lançamento do novo produto premium"
    },
    {
      id: 4,
      name: "Projeto Delta",
      description: "Campanha Black November 2024"
    },
    {
      id: 5,
      name: "Projeto Epsilon",
      description: "Reativação de clientes inativos"
    }
  ]);

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = (newProject: any) => {
    setProjects(prev => [...prev, newProject]);
  };

  const handleEditProject = (id: number, updatedProject: any) => {
    setProjects(prev => prev.map(project => project.id === id ? updatedProject : project));
  };

  const handleDeleteProject = (id: number) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const openEditModal = (project: any) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (project: any) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Projetos</h1>
          <p className="text-muted-foreground">Organize seus números WhatsApp por projetos e campanhas</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Projeto
        </Button>
      </div>

      {/* Search */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projeto..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-foreground flex items-center">
              <FolderOpen className="h-5 w-5 mr-2" />
              Lista de Projetos ({filteredProjects.length})
            </span>
            <Badge variant="secondary">{filteredProjects.length} de {projects.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nome do Projeto</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Descrição</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <FolderOpen className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="font-medium text-foreground">{project.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-foreground" title={project.description}>
                        {project.description.length > 50 
                          ? `${project.description.substring(0, 50)}...` 
                          : project.description
                        }
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditModal(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteModal(project)}
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
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={handleAddProject}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditProject={handleEditProject}
        project={selectedProject}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedProject && handleDeleteProject(selectedProject.id)}
        numberToDelete={selectedProject?.name || ''}
      />
    </div>
  );
};
