'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Pill,
  Users,
  Video,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Início', icon: LayoutDashboard },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/tratamentos', label: 'Tratamentos', icon: Pill },
  { href: '/estabelecimentos', label: 'Locais de Saúde', icon: MapPin },
  { href: '/consultas', label: 'Teleconsultas', icon: Video },
  { href: '/bem-estar', label: 'Bem-Estar', icon: HeartPulse },
  { href: '/rede-de-apoio', label: 'Rede de Apoio', icon: Users },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map(item => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            }
            className="justify-start"
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
