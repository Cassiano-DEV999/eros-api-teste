import type { SVGProps } from 'react';
import { HeartPulse } from 'lucide-react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <HeartPulse {...props} />
  ),
};
