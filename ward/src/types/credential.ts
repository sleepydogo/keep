export type CredentialStatus = 'pending' | 'valid' | 'expiring' | 'expired';

export type Credential = {
  id: string;
  type: string;
  title: string;
  issuer: string;
  issuerDetail: string;
  issued: string;
  validUntil: string;
  details: string;
  mark: string;
  tone: string;
  status: CredentialStatus;
  cardNumber?: string;
  gradient?: string;
  badge?: string;
  templateId?: string;
};

export type OnboardingStep = 'splash' | 'welcome' | 'warning' | 'alias' | 'creating' | 'ready' | 'role-selection' | 'wallet';

export type Screen = 'wallet' | 'pending' | 'added' | 'detail' | 'show';

