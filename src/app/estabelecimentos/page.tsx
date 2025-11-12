import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function EstabelecimentosPage() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-placeholder');

  return (
    <div className="animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Estabelecimentos de Saúde
          </CardTitle>
          <CardDescription>
            Encontre as Unidades Básicas de Saúde (UBS) e Estratégias Saúde da Família (ESF) em Sorocaba e região.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            {mapImage ? (
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                data-ai-hint={mapImage.imageHint}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <p>Carregando mapa...</p>
              </div>
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
