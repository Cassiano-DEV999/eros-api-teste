import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  HeartPulse,
  MapPin,
  Pill,
  Users,
  Video,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const featureCards = [
  {
    title: 'Agenda da Gestante',
    description: 'Nunca perca um compromisso importante.',
    href: '/agenda',
    icon: <CalendarDays className="h-6 w-6" />,
  },
  {
    title: 'Tratamentos',
    description: 'Acompanhe seus medicamentos e suplementos.',
    href: '/tratamentos',
    icon: <Pill className="h-6 w-6" />,
  },
  {
    title: 'Locais de Saúde',
    description: 'Encontre UBS e ESF perto de você.',
    href: '/estabelecimentos',
    icon: <MapPin className="h-6 w-6" />,
  },
  {
    title: 'Teleconsultas',
    description: 'Agende consultas com farmacêuticos.',
    href: '/consultas',
    icon: <Video className="h-6 w-6" />,
  },
  {
    title: 'Bem-Estar',
    description: 'Artigos e dicas para uma gravidez saudável.',
    href: '/bem-estar',
    icon: <HeartPulse className="h-6 w-6" />,
  },
  {
    title: 'Rede de Apoio',
    description: 'Compartilhe sua jornada com quem você ama.',
    href: '/rede-de-apoio',
    icon: <Users className="h-6 w-6" />,
  },
];

export default function DashboardPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'dashboard-hero');

  return (
    <div className="flex flex-col gap-8">
      <Card className="relative flex h-64 flex-col justify-end overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 p-6 sm:p-8">
          <h1 className="font-headline text-3xl font-bold text-white md:text-4xl">
            Bem-vinda, futura mamãe!
          </h1>
          <p className="mt-2 max-w-lg text-lg text-white/90">
            Estamos aqui para te acompanhar em cada passo desta linda jornada.
          </p>
        </div>
      </Card>

      <section>
        <h2 className="mb-4 font-headline text-2xl font-semibold">
          Explore os recursos
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map(card => (
            <Card
              key={card.href}
              className="flex transform-gpu flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="rounded-lg bg-accent p-3 text-accent-foreground">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex justify-end">
                <Button asChild variant="ghost" size="sm">
                  <Link href={card.href}>
                    Acessar <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
