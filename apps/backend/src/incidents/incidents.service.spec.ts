import { Test, TestingModule } from '@nestjs/testing';
import { IncidentSeverity, IncidentStatus } from '@prisma/client';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../prisma/prisma.service';

describe('IncidentsService', () => {
  let service: IncidentsService;

  const prismaMock = {
    incident: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(IncidentsService);
  });

  it('lists incidents for the default organization', async () => {
    prismaMock.incident.findMany.mockResolvedValue([]);

    await service.findAll();

    expect(prismaMock.incident.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'org_default' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('creates an incident with defaults', async () => {
    const created = {
      id: 'inc_1',
      organizationId: 'org_default',
      title: 'API latency spike',
      description: null,
      status: IncidentStatus.OPEN,
      severity: IncidentSeverity.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.incident.create.mockResolvedValue(created);

    const result = await service.create({ title: 'API latency spike' });

    expect(prismaMock.incident.create).toHaveBeenCalledWith({
      data: {
        organizationId: 'org_default',
        title: 'API latency spike',
        description: undefined,
        severity: IncidentSeverity.MEDIUM,
      },
    });
    expect(result).toEqual(created);
  });
});
