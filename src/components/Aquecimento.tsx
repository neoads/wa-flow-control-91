
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Phone,
  Users,
  Link as LinkIcon,
  Trash2,
  Flame,
  Copy,
  Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useWarmingData } from '@/hooks/useWarmingData';

export const Aquecimento = () => {
  const { currentUser } = useApp();
  const [numbersText, setNumbersText] = useState('');
  const [groupsText, setGroupsText] = useState('');
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
  
  const {
    warmingNumbers,
    warmingGroups,
    loading,
    saveWarmingNumbers,
    saveWarmingGroups,
    deleteWarmingNumber,
    deleteWarmingGroup
  } = useWarmingData(currentUser?.id);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      
      toast({
        title: "Copiado!",
        description: "Número copiado para área de transferência.",
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o número.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNumbers = async () => {
    if (!numbersText.trim()) return;

    const success = await saveWarmingNumbers(numbersText);
    if (success) {
      setNumbersText('');
    }
  };

  const handleSaveGroups = async () => {
    if (!groupsText.trim()) return;

    const success = await saveWarmingGroups(groupsText);
    if (success) {
      setGroupsText('');
    }
  };

  const handleDeleteNumber = async (id: string) => {
    await deleteWarmingNumber(id);
  };

  const handleDeleteGroup = async (id: string) => {
    await deleteWarmingGroup(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Flame className="h-6 w-6 mr-2 text-orange-500" />
            Aquecimento de WhatsApp
          </h1>
          <p className="text-muted-foreground">Gerencie números e grupos para aquecimento</p>
        </div>
      </div>

      <Tabs defaultValue="numbers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="numbers" className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Números de Aquecimento</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Links de Grupos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="numbers" className="space-y-6">
          {/* Add Numbers Section */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Adicionar Números de Aquecimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numbers-textarea">Números (um por linha)</Label>
                <Textarea
                  id="numbers-textarea"
                  placeholder={`+5511912345678 | Número de teste da campanha X\n+5562998765432 | Aquece de novo lote VIP`}
                  value={numbersText}
                  onChange={(e) => setNumbersText(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  Formato: +5511999999999 | Descrição (opcional)
                </p>
              </div>
              <Button 
                onClick={handleSaveNumbers}
                className="bg-green-600 hover:bg-green-700"
                disabled={!numbersText.trim() || loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Números de Aquecimento'}
              </Button>
            </CardContent>
          </Card>

          {/* Numbers Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-foreground">Números Cadastrados ({warmingNumbers.length})</span>
                <Badge variant="secondary">{warmingNumbers.length} números</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Copiar</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Número</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Descrição</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warmingNumbers.map((number) => (
                      <tr key={number.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(number.numero, `number-${number.id}`)}
                            className="text-green-600 hover:text-green-700"
                          >
                            {copiedStates[`number-${number.id}`] ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Phone className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-green-500/20">
                              <Phone className="h-4 w-4 text-green-400" />
                            </div>
                            <div>
                              <span className="font-medium text-foreground">{number.numero}</span>
                              <p className="text-xs text-muted-foreground">{number.url}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-foreground">{number.descricao || '-'}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteNumber(number.id)}
                              className="text-red-600 hover:text-red-700"
                              disabled={loading}
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
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          {/* Add Groups Section */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Adicionar Links de Grupos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groups-textarea">Links de Grupos (um por linha)</Label>
                <Textarea
                  id="groups-textarea"
                  placeholder={`Grupo da Campanha A | https://chat.whatsapp.com/inviteLinkA\nLançamento VIP 3 | https://chat.whatsapp.com/inviteLinkB`}
                  value={groupsText}
                  onChange={(e) => setGroupsText(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  Formato: Nome do Grupo | https://chat.whatsapp.com/linkDoGrupo
                </p>
              </div>
              <Button 
                onClick={handleSaveGroups}
                className="bg-green-600 hover:bg-green-700"
                disabled={!groupsText.trim() || loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Links de Grupos'}
              </Button>
            </CardContent>
          </Card>

          {/* Groups Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-foreground">Grupos Cadastrados ({warmingGroups.length})</span>
                <Badge variant="secondary">{warmingGroups.length} grupos</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nome do Grupo</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">URL</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warmingGroups.map((group) => (
                      <tr key={group.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                              <Users className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="font-medium text-foreground">{group.nome}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <a 
                            href={group.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span className="truncate max-w-xs">{group.url}</span>
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteGroup(group.id)}
                              className="text-red-600 hover:text-red-700"
                              disabled={loading}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
