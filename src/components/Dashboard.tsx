
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { 
  Phone, 
  FolderOpen, 
  Users, 
  MessageSquare, 
  Activity,
  CheckCircle,
  Clock,
  Zap,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const { numbers, projects, groups, responsibles } = useApp();
  const { toast } = useToast();

  // Calcular estatísticas
  const stats = {
    total: numbers.length,
    ativo: numbers.filter(n => n.status === 'Ativo').length,
    api: numbers.filter(n => n.status === 'API').length,
    aquecendo: numbers.filter(n => n.status === 'Aquecendo').length,
    inativo: numbers.filter(n => n.status === 'Inativo').length,
    suspenso: numbers.filter(n => n.status === 'Suspenso').length,
  };

  const copyNumber = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      toast({
        title: "Copiado!",
        description: `Número ${number} copiado para área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o número",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'API': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'Aquecendo': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Inativo': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'Suspenso': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-500/10 text-green-500';
      case 'API': return 'bg-blue-500/10 text-blue-500';
      case 'Aquecendo': return 'bg-yellow-500/10 text-yellow-500';
      case 'Inativo': return 'bg-gray-500/10 text-gray-500';
      case 'Suspenso': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const recentNumbers = numbers
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 5);

  // Encontrar nomes dos projetos e responsáveis
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Projeto não encontrado';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Números</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              números cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              projetos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responsáveis</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responsibles.length}</div>
            <p className="text-xs text-muted-foreground">
              usuários ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grupos Salvos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
            <p className="text-xs text-muted-foreground">
              links de grupos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status dos Números</CardTitle>
            <CardDescription>Distribuição por status atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Ativo</span>
              </div>
              <Badge variant="secondary">{stats.ativo}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm">API</span>
              </div>
              <Badge variant="secondary">{stats.api}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Aquecendo</span>
              </div>
              <Badge variant="secondary">{stats.aquecendo}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Inativo</span>
              </div>
              <Badge variant="secondary">{stats.inativo}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Suspenso</span>
              </div>
              <Badge variant="secondary">{stats.suspenso}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Números Adicionados</CardTitle>
            <CardDescription>5 registros mais recentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNumbers.length > 0 ? (
              recentNumbers.map((number) => (
                <div key={number.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyNumber(number.number)}
                      className="h-8 w-8 p-0 text-green-500 hover:text-green-600"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <div>
                      <p className="text-sm font-medium">{number.number}</p>
                      <p className="text-xs text-muted-foreground">{getProjectName(number.project_id)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(number.status)}
                    <Badge className={getStatusColor(number.status)}>
                      {number.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum número cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
