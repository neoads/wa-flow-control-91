
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
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Com API Conectada",
      value: "187",
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Banidos",
      value: "12",
      change: "-3%",
      trend: "down",
      icon: PhoneOff,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Aguardando",
      value: "45",
      change: "+5%",
      trend: "up",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
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
      case "Ativo": return "bg-green-100 text-green-800";
      case "API": return "bg-blue-100 text-blue-800";
      case "Aquecendo": return "bg-yellow-100 text-yellow-800";
      case "Banido": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral da sua operação WhatsApp</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Número
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <TrendingUp className={`h-3 w-3 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimos Números Adicionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNumbers.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{item.number}</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.project} • {item.user}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alertas e Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">3 números próximos ao limite</p>
                  <p className="text-sm text-yellow-700">Verifique a API dos números que estão com alto volume</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Aquecimento concluído</p>
                  <p className="text-sm text-blue-700">5 números estão prontos para uso</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
