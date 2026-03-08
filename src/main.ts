import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const defaultOrigins = ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000'];
  const envOrigins = String(process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  const platformOrigins = [process.env.RENDER_EXTERNAL_URL, process.env.FRONTEND_URL]
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  const allowedOrigins = new Set([...defaultOrigins, ...envOrigins, ...platformOrigins]);
  const allowAllOrigins = allowedOrigins.has('*');

  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      const isRenderOrigin = Boolean(origin && origin.endsWith('.onrender.com'));
      if (!origin || allowAllOrigins || allowedOrigins.has(origin) || isRenderOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}/api`);
}

bootstrap();
