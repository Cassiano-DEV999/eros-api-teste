'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, MapPin, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const appointmentSchema = z.object({
  event: z.string().min(1, 'O nome do evento é obrigatório.'),
  local: z.string().min(1, 'O local é obrigatório.'),
  date: z.date({ required_error: 'A data é obrigatória.' }),
  time: z.string().min(1, 'O horário é obrigatório.'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;
type Appointment = AppointmentFormValues & { id: string };

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      event: '',
      local: '',
      time: '',
    },
  });

  function onSubmit(data: AppointmentFormValues) {
    const newAppointment: Appointment = {
      ...data,
      id: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment].sort((a,b) => a.date.getTime() - b.date.getTime()));
    toast({
      title: 'Compromisso Agendado!',
      description: `${data.event} foi adicionado à sua agenda.`,
    });
    form.reset();
  }

  return (
    <div className="grid animate-fade-in gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Compromisso</CardTitle>
            <CardDescription>
              Preencha os detalhes do seu próximo evento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="event"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Consulta pré-natal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: UBS Vila Hortência" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: ptBR })
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={date => date < new Date(new Date().toDateString())}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Compromissos</CardTitle>
            <CardDescription>Sua agenda para as próximas semanas.</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  Nenhum compromisso agendado
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use o formulário ao lado para adicionar seu primeiro compromisso.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {appointments.map(app => (
                  <li
                    key={app.id}
                    className="flex items-start space-x-4 rounded-md border p-4"
                  >
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <span className="text-sm font-semibold uppercase">
                        {format(app.date, 'MMM', { locale: ptBR })}
                      </span>
                      <span className="text-xl font-bold">
                        {format(app.date, 'dd')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{app.event}</h4>
                      <p className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" /> {app.local}
                      </p>
                      <p className="mt-1 flex items-center text-sm font-medium">
                        <Clock className="mr-2 h-4 w-4" /> {app.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
