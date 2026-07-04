import 'dotenv/config';

import { getCoreDb, disconnectCoreDb } from '../src/db/client.js';
import { disconnectEdgeDb } from '../src/db/edge-client.js';
import { payloadHash } from '../src/db/sync/conflicts.js';

const ORIGIN_NODE = 'node-demo-bog-01';
const ORIGIN_PERIPHERAL = 'node-mar-north-01';

async function main(): Promise<void> {
  const db = getCoreDb();

  const territory = await db.territorialNode.upsert({
    where: { code: 'BOG_CENTER_01' },
    create: {
      code: 'BOG_CENTER_01',
      name: 'Nodo Central Bogotá Demo',
      originNodeId: ORIGIN_NODE,
    },
    update: { name: 'Nodo Central Bogotá Demo' },
  });

  const citizen = await db.citizen.upsert({
    where: { did: 'did:armada:bog:demo-citizen-01' },
    create: {
      did: 'did:armada:bog:demo-citizen-01',
      displayName: 'Ciudadano Demo',
      territoryId: territory.id,
      originNodeId: ORIGIN_NODE,
    },
    update: { displayName: 'Ciudadano Demo' },
  });

  await db.trustNode.upsert({
    where: { citizenDid: citizen.did },
    create: {
      citizenDid: citizen.did,
      territoryId: territory.id,
      score: 1.0,
      originNodeId: ORIGIN_NODE,
    },
    update: { score: 1.0 },
  });

  const territoryPeripheral = await db.territorialNode.upsert({
    where: { code: 'MAR_NORTH_01' },
    create: {
      code: 'MAR_NORTH_01',
      name: 'Nodo Periférico Maracaibo Norte Demo',
      originNodeId: ORIGIN_PERIPHERAL,
    },
    update: { name: 'Nodo Periférico Maracaibo Norte Demo' },
  });

  await db.citizen.upsert({
    where: { did: 'did:armada:mar:demo-citizen-01' },
    create: {
      did: 'did:armada:mar:demo-citizen-01',
      displayName: 'Ciudadano Periférico Demo',
      territoryId: territoryPeripheral.id,
      originNodeId: ORIGIN_PERIPHERAL,
    },
    update: { displayName: 'Ciudadano Periférico Demo' },
  });

  await db.processCheckpoint.upsert({
    where: { processId: 'proc-seed-001' },
    create: {
      processId: 'proc-seed-001',
      status: 'received',
      agentId: 'centinela',
      evidenceBundle: { seeded: true },
      originNodeId: ORIGIN_NODE,
    },
    update: {},
  });

  await db.processCheckpoint.upsert({
    where: { processId: 'proc-seed-public-001' },
    create: {
      processId: 'proc-seed-public-001',
      status: 'published',
      agentId: 'comunicador',
      evidenceBundle: {
        publicMetrics: {
          processId: 'proc-seed-public-001',
          status: 'published',
          factCount: 3,
          hashCount: 2,
          publishedAt: new Date().toISOString(),
        },
      },
      originNodeId: ORIGIN_NODE,
    },
    update: {
      status: 'published',
      agentId: 'comunicador',
    },
  });

  await db.acta.upsert({
    where: { processId: 'acta-seed-001' },
    create: {
      processId: 'acta-seed-001',
      title: 'Dictamen distribución_agua_sector_norte',
      contentHash: payloadHash({ acta: 'acta-seed-001', v: 1 }),
      sovereignDid: 'did:armada:core:soberano',
      status: 'committed',
      territoryId: territory.id,
      originNodeId: ORIGIN_NODE,
    },
    update: { status: 'committed' },
  });

  const escrowSpecs = [
    { processId: 'escrow-seed-pending', status: 'PENDING' as const, amount: '5000.0000' },
    { processId: 'escrow-seed-locked', status: 'LOCKED' as const, amount: '12000.0000' },
    { processId: 'escrow-seed-released', status: 'RELEASED' as const, amount: '8000.0000' },
  ];

  for (const spec of escrowSpecs) {
    await db.escrow.upsert({
      where: { processId: spec.processId },
      create: {
        processId: spec.processId,
        territoryId: territoryPeripheral.id,
        amount: spec.amount,
        currency: 'VES',
        status: spec.status,
        threshold: 2,
        signers: ['did:armada:core:logistico', 'did:armada:core:soberano'],
        originNodeId: ORIGIN_PERIPHERAL,
      },
      update: { status: spec.status, amount: spec.amount },
    });
  }

  const daoProjects = [
    {
      processId: 'proj-dao-agua-zulia',
      title: 'Red de agua potable — Costa norte Zulia',
      sector: 'infraestructura',
      territoryCode: 'MAR_NORTH_01',
      escrowProcessId: 'escrow-seed-locked',
      targetAmount: '12000.0000',
      raisedAmount: '8450.0000',
      contributions: 127,
      milestones: [
        { label: 'Estudio técnico', done: true },
        { label: 'Tubería tramo 1', done: true },
        { label: 'Conexiones domiciliarias', done: false },
      ],
    },
    {
      processId: 'proj-dao-escuela-rural',
      title: 'Escuela rural conectada — Fe y Alegría piloto',
      sector: 'educacion',
      territoryCode: 'MAR_NORTH_01',
      escrowProcessId: 'escrow-seed-pending',
      targetAmount: '5000.0000',
      raisedAmount: '2100.0000',
      contributions: 43,
      milestones: [
        { label: 'Dictamen soberano', done: true },
        { label: 'DAO aprobación', done: false },
        { label: 'Construcción módulo 1', done: false },
      ],
    },
    {
      processId: 'proj-dao-salud-movil',
      title: 'Clínica móvil — Atención primaria rural',
      sector: 'salud',
      territoryCode: 'MAR_NORTH_01',
      escrowProcessId: 'escrow-seed-released',
      targetAmount: '8000.0000',
      raisedAmount: '8000.0000',
      contributions: 201,
      milestones: [
        { label: 'Equipamiento', done: true },
        { label: 'Personal capacitado', done: true },
        { label: 'Primer ciclo atención', done: true },
      ],
    },
  ];

  for (const project of daoProjects) {
    await db.processCheckpoint.upsert({
      where: { processId: project.processId },
      create: {
        processId: project.processId,
        status: 'published',
        agentId: 'comunicador',
        evidenceBundle: {
          publicProject: {
            ...project,
            currency: 'VES',
            daoApproved: project.escrowProcessId !== 'escrow-seed-pending',
            publishedAt: new Date().toISOString(),
          },
        },
        originNodeId: ORIGIN_PERIPHERAL,
      },
      update: {
        status: 'published',
        agentId: 'comunicador',
        evidenceBundle: {
          publicProject: {
            ...project,
            currency: 'VES',
            daoApproved: project.escrowProcessId !== 'escrow-seed-pending',
            publishedAt: new Date().toISOString(),
          },
        },
      },
    });

    await db.ledgerEntry.createMany({
      data: [
        {
          entryType: 'PROCESS',
          entityId: project.processId,
          entityHash: payloadHash({ project: project.processId }),
          processId: project.processId,
          agentId: 'comunicador',
          evidenceRef: 'seed-dao-project',
        },
      ],
      skipDuplicates: true,
    });
  }

  await db.ledgerEntry.createMany({
    data: [
      {
        entryType: 'PROCESS',
        entityId: 'proc-seed-public-001',
        entityHash: payloadHash({ process: 'proc-seed-public-001' }),
        processId: 'proc-seed-public-001',
        agentId: 'comunicador',
        evidenceRef: 'seed-public-dashboard',
      },
      {
        entryType: 'ACTA',
        entityId: 'acta-seed-001',
        entityHash: payloadHash({ acta: 'acta-seed-001' }),
        processId: 'acta-seed-001',
        agentId: 'soberano',
        evidenceRef: 'seed-acta-demo',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed core OK:', {
    territory: territory.code,
    territoryPeripheral: territoryPeripheral.code,
    citizen: citizen.did,
  });

  await disconnectCoreDb();
}

main().catch(async (error) => {
  console.error(error);
  await disconnectCoreDb();
  await disconnectEdgeDb();
  process.exit(1);
});
