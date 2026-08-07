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
};

export type OnboardingStep = 'splash' | 'welcome' | 'warning' | 'creating' | 'ready' | 'wallet';

export type Screen = 'wallet' | 'pending' | 'added' | 'detail' | 'show';
