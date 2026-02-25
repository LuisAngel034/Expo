// @ts-ignore
import Aikido from '@aikidosec/firewall';

const Zen = (Aikido as any).default || Aikido;

if (Zen && typeof Zen.start === 'function') {
  Zen.start({
    token: process.env.AIKIDO_TOKEN,
    environment: 'development'
  });
}

import type { Core } from '@strapi/strapi';
// ... el resto de tu código (register y bootstrap)