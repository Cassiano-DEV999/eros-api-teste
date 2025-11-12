'use client';

import { useState } from 'react';
import { AlertCircle, Pill, PlusCircle, Trash2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { medicationInteractionCheck } from '@/ai/flows/medication-interaction-check';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type TreatmentItem = {
  id: string;
  name: string;
  schedule: string;
  duration: string;
};

type ItemType = 'medication' | 'supplement';

export default function TratamentosPage() {
  const [medications, setMedications] = useState<TreatmentItem[]>([]);
  const [supplements, setSupplements] = useState<TreatmentItem[]>([]);

  const [newName, setNewName] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newDuration, setNewDuration] = useState('');
  
  const [isChecking, setIsChecking] = useState(false);
  const [interactionAlert, setInteractionAlert] = useState<{ open: boolean; interactions: string[] }>({ open: false, interactions: [] });

  const { toast } = useToast();

  const handleAddItem = async (type: ItemType) => {
    if (!newName || !newSchedule || !newDuration) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    
    const currentMedications = [...medications.map(m => m.name), ...supplements.map(s => s.name)];
    const proposedList = [...currentMedications, newName];
    
    try {
        const result = await medicationInteractionCheck({ medicationList: proposedList });

        if (result.hasInteractions) {
            setInteractionAlert({ open: true, interactions: result.interactions });
        } else {
            const newItem: TreatmentItem = {
                id: new Date().toISOString(),
                name: newName,
                schedule: newSchedule,
                duration: newDuration,
            };

            if (type === 'medication') {
                setMedications(prev => [...prev, newItem]);
            } else {
                setSupplements(prev => [...prev, newItem]);
            }

            toast({ title: 'Item adicionado!', description: `${newName} foi adicionado à sua lista de tratamentos.` });
            setNewName('');
            setNewSchedule('');
            setNewDuration('');
        }
    } catch (error) {
        console.error('Error checking medication interactions:', error);
        toast({
            title: 'Erro ao verificar',
            description: 'Não foi possível verificar as interações medicamentosas. Tente novamente.',
            variant: 'destructive',
        });
    } finally {
        setIsChecking(false);
    }
  };
  
  const handleDeleteItem = (id: string, type: ItemType) => {
    if (type === 'medication') {
        setMedications(prev => prev.filter(item => item.id !== id));
    } else {
        setSupplements(prev => prev.filter(item => item.id !== id));
    }
    toast({ title: 'Item removido.' });
  }

  const renderTreatmentList = (items: TreatmentItem[], type: ItemType) => {
    if (items.length === 0) {
      return (
        <p className="text-center text-muted-foreground p-8">
          Nenhum {type === 'medication' ? 'medicamento' : 'suplemento'} adicionado.
        </p>
      );
    }
    return (
      <ul className="space-y-3">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                Horários: {item.schedule} | Duração: {item.duration}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id, type)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="animate-fade-in">
        <Tabs defaultValue="medication">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="medication"><Pill className="mr-2 h-4 w-4"/>Medicamentos</TabsTrigger>
            <TabsTrigger value="supplement"><Leaf className="mr-2 h-4 w-4"/>Suplementos</TabsTrigger>
          </TabsList>
          
          <Card className='mt-4'>
            <CardHeader>
                <CardTitle>Adicionar Novo Item</CardTitle>
                <CardDescription>Insira as informações do seu medicamento ou suplemento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" placeholder="Ex: Ácido Fólico" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="schedule">Horários</Label>
                        <Input id="schedule" placeholder="Ex: 08:00, 20:00" value={newSchedule} onChange={(e) => setNewSchedule(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="duration">Tempo de Tratamento</Label>
                        <Input id="duration" placeholder="Ex: 30 dias" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
                    </div>
                </div>
                 <TabsContent value="medication" className='m-0'>
                    <Button onClick={() => handleAddItem('medication')} disabled={isChecking} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> {isChecking ? 'Verificando...' : 'Adicionar Medicamento'}
                    </Button>
                </TabsContent>
                <TabsContent value="supplement" className='m-0'>
                    <Button onClick={() => handleAddItem('supplement')} disabled={isChecking} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> {isChecking ? 'Verificando...' : 'Adicionar Suplemento'}
                    </Button>
                </TabsContent>
            </CardContent>
          </Card>

          <TabsContent value="medication">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Seus Medicamentos</CardTitle>
              </CardHeader>
              <CardContent>{renderTreatmentList(medications, 'medication')}</CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="supplement">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Seus Suplementos</CardTitle>
              </CardHeader>
              <CardContent>{renderTreatmentList(supplements, 'supplement')}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={interactionAlert.open} onOpenChange={(open) => setInteractionAlert(prev => ({...prev, open}))}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                        Atenção: Possível Interação!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Nossa análise identificou potenciais interações ou efeitos colaterais com a adição de <strong>{newName}</strong>. É altamente recomendável que você converse com seu médico ou farmacêutico antes de iniciar o uso.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4 max-h-48 overflow-y-auto rounded-md bg-muted p-4">
                    <h4 className="font-semibold mb-2">Interações Encontradas:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                        {interactionAlert.interactions.map((interaction, index) => (
                            <li key={index}>{interaction}</li>
                        ))}
                    </ul>
                </div>
                <AlertDialogAction onClick={() => setInteractionAlert({ open: false, interactions: [] })}>
                    Entendi
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
