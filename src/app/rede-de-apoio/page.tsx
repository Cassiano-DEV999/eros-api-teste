'use client';

import { useEffect, useState } from 'react';
import { Copy, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function RedeDeApoioPage() {
  const [accessCode, setAccessCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Generate a random 8-character alphanumeric code on client mount
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setAccessCode(code);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accessCode);
    toast({
      title: 'Código Copiado!',
      description: 'Você pode compartilhar seu código da rede de apoio.',
    });
  };

  return (
    <div className="animate-fade-in grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Share2 className="h-6 w-6" />
            Sua Rede de Apoio
          </CardTitle>
          <CardDescription>
            Compartilhe este código com sua família e amigos para que eles possam acompanhar sua jornada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Este é seu código de acesso exclusivo. Pessoas com este código poderão ver sua agenda, tratamentos e locais de saúde.
          </p>
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={accessCode || 'Gerando...'}
              className="font-mono text-lg h-12"
            />
            <Button size="icon" onClick={handleCopyCode} disabled={!accessCode}>
              <Copy className="h-5 w-5" />
              <span className="sr-only">Copiar código</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Users className="h-6 w-6" />
            Acessar Rede de Apoio
          </CardTitle>
          <CardDescription>
            Insira o código que você recebeu para se conectar à rede de apoio de uma gestante.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code-input" className="text-sm">Código de Acesso</Label>
              <Input id="code-input" placeholder="Insira o código aqui" className="mt-1" />
            </div>
            <Button className="w-full">Entrar na Rede de Apoio</Button>
        </CardContent>
      </Card>
    </div>
  );
}
