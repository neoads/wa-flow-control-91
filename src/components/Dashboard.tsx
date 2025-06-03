
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneOff, 
  Activity, 
  AlertTriangle,
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react';

export const Dashboard = () => {
  const kpis = [
    {
      title: "Números Ativos",
      value: "234",
      change: "+12%",
      trend: "up",
      icon: Phone,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Com API Conectada",
      value: "187",
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Banidos",
      value: "12",
      change: "-3%",
      trend: "down",
      icon: PhoneOff,
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      title: "Aguardando",
      value: "45",
      change: "+5%",
      trend: "up",
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    }
  ];

  const recentNumbers = [
    { number: "+55 11 99999-0001", status: "Ativo", project: "Projeto Alpha", user: "João Silva", time: "2h" },
    { number: "+55 11 99999-0002", status: "API", project: "Projeto Beta", user: "Maria Santos", time: "4h" },
    { number: "+55 11 99999-0003", status: "Aquecendo", project: "Projeto Gamma", user: "Pedro Costa", time: "6h" },
    { number: "+55 11 99999-0004", status: "Ativo", project: "Projeto Alpha", user: "Ana Oliveira", time: "1d" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "API": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "Aquecendo": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Banido": return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua operação WhatsApp</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Número
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:shadow-lg transition-shadow border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <TrendingUp className={`h-3 w-3 ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Últimos Números Adicionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNumbers.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-foreground">{item.number}</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.project} • {item.user}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Alertas e Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-300">3 números próximos ao limite</p>
                  <p className="text-sm text-yellow-400/80">Verifique a API dos números que estão com alto volume</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <Activity className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-300">Aquecimento concluído</p>
                  <p className="text-sm text-blue-400/80">5 números estão prontos para uso</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
