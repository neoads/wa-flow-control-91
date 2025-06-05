
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Trash2, 
  Eye,
  Shield
} from 'lucide-react';

interface SecurityConfiguration {
  id: string;
  configuration_name: string;
  email_recuperacao: string;
  mensagem_recuperacao: string;
  created_at: string;
  updated_at: string;
}

interface SecurityConfigurationsListProps {
  configurations: SecurityConfiguration[];
  onLoad: (config: SecurityConfiguration) => void;
  onDelete: (configId: string) => void;
  loading?: boolean;
}

export const SecurityConfigurationsList = ({
  configurations,
  onLoad,
  onDelete,
  loading = false
}: SecurityConfigurationsListProps) => {
  if (configurations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Nenhuma configuração de segurança salva</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {configurations.map((config) => (
        <div
          key={config.id}
          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
        >
          <div className="flex items-center space-x-3 flex-1">
            <Shield className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{config.configuration_name}</span>
                <Badge variant="secondary" className="text-xs">
                  Configuração
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                E-mail: {config.email_recuperacao || 'Não definido'}
              </div>
              <div className="text-xs text-muted-foreground">
                Atualizado: {new Date(config.updated_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLoad(config)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              disabled={loading}
            >
              <Eye className="h-4 w-4 mr-1" />
              Carregar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(config.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
