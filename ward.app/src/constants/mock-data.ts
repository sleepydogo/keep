import type { Credential } from '@/types/credential';

export type { Credential, CredentialStatus } from '@/types/credential';

export const credentials: Credential[] = [
  {
    id: 'age',
    type: 'Identidad',
    title: 'Mayoría de edad',
    issuer: 'Registro Civil',
    issuerDetail: 'República Argentina',
    issued: '12 jun 2026',
    validUntil: '12 jun 2027',
    details: 'Acredita que la persona es mayor de 18 años.',
    mark: '18',
    tone: '#2E6B63',
    status: 'valid',
  },
  {
    id: 'degree',
    type: 'Título universitario',
    title: 'Licenciatura en Diseño',
    issuer: 'Universidad de Buenos Aires',
    issuerDetail: 'Facultad de Arquitectura, Diseño y Urbanismo',
    issued: '18 dic 2025',
    validUntil: 'Sin vencimiento',
    details: 'Título de grado emitido por la Universidad de Buenos Aires.',
    mark: 'UBA',
    tone: '#B0813A',
    status: 'valid',
  },
];

export const pendingCredential: Credential = {
  id: 'repro',
  type: 'Autorización',
  title: 'Autorización vigente',
  issuer: 'Ministerio de Salud',
  issuerDetail: 'República Argentina',
  issued: '7 ago 2026',
  validUntil: '7 ago 2027',
  details: 'Autorización emitida por el Ministerio de Salud.',
  mark: '✓',
  tone: '#9B4A3B',
  status: 'pending',
};
