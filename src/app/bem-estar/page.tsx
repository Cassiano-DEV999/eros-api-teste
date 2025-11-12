'use client';

import { useState } from 'react';
import { BookOpen, ChevronsRight, HeartPulse } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const educationalTopics = [
    { id: 'suplementos', title: 'Suplementos', content: 'Informações detalhadas sobre suplementos essenciais durante a gestação, como ácido fólico, ferro, e vitamina D. Discutimos dosagens recomendadas, melhores fontes e a importância de cada um para o desenvolvimento do bebê e a saúde da mãe.' },
    { id: 'vitaminas', title: 'Vitaminas', content: 'Um guia completo sobre as vitaminas necessárias na gravidez. Abordamos os benefícios das vitaminas A, C, E, e do complexo B, além de como obtê-las através da alimentação e suplementação segura.' },
    { id: 'fitoterapicos', title: 'Fitoterápicos', content: 'Cuidado com fitoterápicos! Muitos não são seguros durante a gestação. Este guia aborda quais plantas são consideradas seguras com moderação, como camomila e gengibre para náuseas, e quais devem ser estritamente evitadas.' },
    { id: 'vacinas', title: 'Vacinas', content: 'A imunização é crucial para proteger você e seu bebê. Detalhamos as vacinas recomendadas durante a gravidez, como a dTpa (tétano, difteria e coqueluche) e a vacina da gripe, e explicamos por que são seguras e importantes.' },
    { id: 'pre-natal', title: 'Pré-natal', content: 'O acompanhamento pré-natal é fundamental. Explicamos a frequência das consultas, os exames que serão solicitados em cada trimestre e a importância de seguir todas as orientações médicas para uma gestação saudável.' },
    { id: 'ist', title: 'ISTs na Gestação', content: 'As Infecções Sexualmente Transmissíveis (ISTs) podem trazer riscos para a mãe e o bebê. Informamos sobre a prevenção, os testes que devem ser feitos durante o pré-natal e as opções de tratamento seguro.' },
    { id: 'puerperio', title: 'Puerpério', content: 'O período pós-parto, conhecido como puerpério, traz muitas mudanças físicas e emocionais. Oferecemos dicas e informações para navegar esta fase, abordando a recuperação do corpo, cuidados com o recém-nascido e a importância do descanso.' },
    { id: 'depressao-pos-parto', title: 'Depressão Pós-Parto', content: 'A depressão pós-parto é uma condição séria que afeta muitas mães. Ensinamos a reconhecer os sinais, a diferença entre "baby blues" e depressão, e onde buscar ajuda profissional e apoio.' },
    { id: 'aleitamento', title: 'Aleitamento Materno', content: 'Guia prático para o aleitamento materno. Cobrimos desde a "pega" correta, posições para amamentar, como lidar com desafios comuns como mamilos rachados e baixa produção de leite, até os imensos benefícios para a mãe e o bebê.' },
];

type Topic = (typeof educationalTopics)[0];

export default function BemEstarPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  return (
    <div className="grid animate-fade-in gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Material Educativo</CardTitle>
            <CardDescription>
              Escolha um tópico para saber mais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {educationalTopics.map(topic => (
                <li key={topic.id}>
                  <button
                    onClick={() => setSelectedTopic(topic)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md p-3 text-left transition-colors',
                      selectedTopic?.id === topic.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    )}
                  >
                    <span className="font-medium">{topic.title}</span>
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card className="min-h-[60vh]">
          <CardContent className="flex h-full items-center justify-center p-6">
            {!selectedTopic ? (
              <div className="text-center text-muted-foreground">
                <HeartPulse className="mx-auto h-16 w-16" />
                <h3 className="mt-4 text-xl font-semibold">
                  Bem-estar da Mamãe
                </h3>
                <p className="mt-2">
                  Selecione um tópico ao lado para ler o conteúdo.
                </p>
              </div>
            ) : (
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <h2 className='font-headline text-3xl font-bold mb-4'>{selectedTopic.title}</h2>
                    <p className='text-lg leading-relaxed'>{selectedTopic.content}</p>
                </article>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
