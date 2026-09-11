import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  corsOrigin: string;
}

export default registerAs('app', (): AppConfig => ({
  port: Number(process.env['PORT'] ?? 3000),
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:4200',
}));
