import { Injectable } from '@nestjs/common';
import { Incident, IncidentSeverity, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

const DEFAULT_ORGANIZATION_ID = 'org_default';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(organizationId = DEFAULT_ORGANIZATION_ID): Promise<Incident[]> {
    return this.prisma.incident.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(
    dto: CreateIncidentDto,
    organizationId = DEFAULT_ORGANIZATION_ID,
  ): Promise<Incident> {
    const data: Prisma.IncidentCreateInput = {
      organizationId,
      title: dto.title,
      description: dto.description,
      severity: dto.severity ?? IncidentSeverity.MEDIUM,
    };

    return this.prisma.incident.create({ data });
  }
}
