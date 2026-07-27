import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { IncidentsModule } from './incidents/incidents.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, HealthModule, IncidentsModule],
})
export class AppModule {}
