
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
  Edit,
  Flame,
  Copy,
  Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export const Aquecimento = () => {
  const [numbersText, setNumbersText] = useState('');
  const [groupsText, setGroupsText] = useState('');
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
  
  const [warmupNumbers, setWarmupNumbers] = useState([
    {
      id: 1,
      number: "+5511912345678",
      description: "Número de teste da campanha X",
      url: "https://wa.me/5511912345678"
    },
    {
      id: 2,
      number: "+5562998765432",
      description: "Aquece de novo lote VIP",
      url: "https://wa.me/5562998765432"
    }
  ]);

  const [warmupGroups, setWarmupGroups] = useState([
    {
      id: 1,
      name: "Grupo da Campanha A",
      url: "https://chat.whatsapp.com/inviteLinkA"
    },
    {
      id: 2,
      name: "Lançamento VIP 3",
      url: "https://chat.whatsapp.com/inviteLinkB"
    }
  ]);

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

  const handleSaveNumbers = () => {
    if (!numbersText.trim()) return;

    const lines = numbersText.trim().split('\n');
    const newNumbers = lines.map((line, index) => {
      const parts = line.split('|');
      const number = parts[0]?.trim();
      const description = parts[1]?.trim() || '';
      
      // Remove +55 from number for URL generation
      const urlNumber = number?.replace('+', '');
      
      return {
        id: Date.now() + index,
        number,
        description,
        url: `https://wa.me/${urlNumber}`
      };
    }).filter(item => item.number && item.number.startsWith('+55'));

    // Check for duplicates
    const existingNumbers = warmupNumbers.map(n => n.number);
    const uniqueNumbers = newNumbers.filter(n => !existingNumbers.includes(n.number));

    if (uniqueNumbers.length === 0) {
      toast({
        title: "Aviso",
        description: "Todos os números já estão cadastrados.",
        variant: "destructive",
      });
      return;
    }

    setWarmupNumbers(prev => [...prev, ...uniqueNumbers]);
    setNumbersText('');
    
    toast({
      title: "Sucesso!",
      description: `${uniqueNumbers.length} números de aquecimento salvos.`,
    });
  };

  const handleSaveGroups = () => {
    if (!groupsText.trim()) return;

    const lines = groupsText.trim().split('\n');
    const newGroups = lines.map((line, index) => {
      const parts = line.split('|');
      const name = parts[0]?.trim();
      const url = parts[1]?.trim();
      
      return {
        id: Date.now() + index,
        name,
        url
      };
    }).filter(item => item.name && item.url && item.url.includes('chat.whatsapp.com'));

    // Check for duplicates
    const existingUrls = warmupGroups.map(g => g.url);
    const uniqueGroups = newGroups.filter(g => !existingUrls.includes(g.url));

    if (uniqueGroups.length === 0) {
      toast({
        title: "Aviso",
        description: "Todos os grupos já estão cadastrados.",
        variant: "destructive",
      });
      return;
    }

    setWarmupGroups(prev => [...prev, ...uniqueGroups]);
    setGroupsText('');
    
    toast({
      title: "Sucesso!",
      description: `${uniqueGroups.length} grupos salvos.`,
    });
  };

  const deleteNumber = (id: number) => {
    setWarmupNumbers(prev => prev.filter(num => num.id !== id));
    toast({
      title: "Removido",
      description: "Número de aquecimento removido.",
    });
  };

  const deleteGroup = (id: number) => {
    setWarmupGroups(prev => prev.filter(group => group.id !== id));
    toast({
      title: "Removido",
      description: "Grupo removido.",
    });
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
                disabled={!numbersText.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Salvar Números de Aquecimento
              </Button>
            </CardContent>
          </Card>

          {/* Numbers Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-foreground">Números Cadastrados ({warmupNumbers.length})</span>
                <Badge variant="secondary">{warmupNumbers.length} números</Badge>
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
                    {warmupNumbers.map((number) => (
                      <tr key={number.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(number.number, `number-${number.id}`)}
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
                              <span className="font-medium text-foreground">{number.number}</span>
                              <p className="text-xs text-muted-foreground">{number.url}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-foreground">{number.description}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteNumber(number.id)}
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
                disabled={!groupsText.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Salvar Links de Grupos
              </Button>
            </CardContent>
          </Card>

          {/* Groups Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-foreground">Grupos Cadastrados ({warmupGroups.length})</span>
                <Badge variant="secondary">{warmupGroups.length} grupos</Badge>
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
                    {warmupGroups.map((group) => (
                      <tr key={group.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                              <Users className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="font-medium text-foreground">{group.name}</span>
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
                              onClick={() => deleteGroup(group.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
