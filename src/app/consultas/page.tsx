'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, CreditCard, QrCode, Stethoscope, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

const availableSlots = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
];

export default function ConsultasPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const { toast } = useToast();
    const qrCodeImage = PlaceHolderImages.find(p => p.id === 'qr-code-placeholder');

    const handlePayment = (method: 'PIX' | 'Cartão') => {
        toast({
            title: "Pagamento Confirmado!",
            description: `Sua consulta foi agendada para ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}. O link será enviado por e-mail.`
        });
        setSelectedTime(null);
    }
    
    const copyPixCode = () => {
        navigator.clipboard.writeText('00020126330014br.gov.bcb.pix011112345678901');
        toast({ title: 'Código PIX copiado!' });
    }

  return (
    <div className="animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Stethoscope className="h-8 w-8" />
            Agendar Teleconsulta Farmacêutica
          </CardTitle>
          <CardDescription>
            Converse com um de nossos farmacêuticos clínicos para tirar suas dúvidas sobre medicamentos, suplementos e bem-estar na gestação.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
            <div>
                <Label htmlFor='date' className='font-semibold text-lg mb-2 block'><Calendar className='inline-block mr-2 h-5 w-5'/>Selecione uma data</Label>
                <Input type='date' id='date' defaultValue={selectedDate.toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value + "T00:00:00"))} className='mb-6' />
                
                <Label className='font-semibold text-lg mb-4 block'><Clock className='inline-block mr-2 h-5 w-5'/>Escolha um horário</Label>
                <div className='grid grid-cols-3 gap-2'>
                    {availableSlots.map(time => (
                        <Button key={time} variant={selectedTime === time ? 'default' : 'outline'} onClick={() => setSelectedTime(time)}>
                            {time}
                        </Button>
                    ))}
                </div>
            </div>

            <div className='flex items-center justify-center rounded-lg bg-accent/50 p-6'>
                {selectedTime ? (
                    <Card className='w-full max-w-sm'>
                        <CardHeader>
                            <CardTitle>Resumo do Agendamento</CardTitle>
                            <CardDescription>Confirme os detalhes e prossiga para o pagamento.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
                            <p><strong>Horário:</strong> {selectedTime}</p>
                            <p><strong>Valor:</strong> R$ 80,00</p>
                            <div className='mt-6 flex flex-col gap-3'>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className='w-full'><CreditCard className='mr-2 h-4 w-4'/>Pagar com Cartão de Crédito</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Pagamento com Cartão</DialogTitle>
                                        </DialogHeader>
                                        <div className='space-y-4 py-4'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='card-number'>Número do Cartão</Label>
                                                <Input id='card-number' placeholder='0000 0000 0000 0000' />
                                            </div>
                                            <div className='grid grid-cols-3 gap-4'>
                                                <div className='space-y-2 col-span-2'>
                                                    <Label htmlFor='expiry'>Validade</Label>
                                                    <Input id='expiry' placeholder='MM/AA' />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='cvv'>CVV</Label>
                                                    <Input id='cvv' placeholder='123' />
                                                </div>
                                            </div>
                                        </div>
                                        <Button onClick={() => handlePayment('Cartão')}>Confirmar Pagamento</Button>
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant='secondary' className='w-full'><QrCode className='mr-2 h-4 w-4'/>Pagar com PIX</Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-md'>
                                        <DialogHeader>
                                            <DialogTitle>Pagamento com PIX</DialogTitle>
                                            <DialogDescription>Use o app do seu banco para ler o QR Code ou copie o código.</DialogDescription>
                                        </DialogHeader>
                                        <div className='flex flex-col items-center gap-4 py-4'>
                                            {qrCodeImage && <Image src={qrCodeImage.imageUrl} alt="QR Code" data-ai-hint={qrCodeImage.imageHint} width={200} height={200} />}
                                            <Button onClick={copyPixCode}>Copiar Código PIX</Button>
                                            <Button variant='outline' onClick={() => handlePayment('PIX')}>Já paguei, confirmar agendamento</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className='text-center text-muted-foreground'>
                        <Video className='mx-auto h-16 w-16' />
                        <h3 className='mt-4 text-xl font-semibold'>Selecione um horário</h3>
                        <p>Escolha um dos horários disponíveis para continuar.</p>
                    </div>
                )}
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
