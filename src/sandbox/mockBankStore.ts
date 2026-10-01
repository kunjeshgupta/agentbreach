// Simulated in-memory ledger and account store for PayVortex Financial Sandbox

export interface AccountRecord {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
  kycStatus: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
}

export interface SideEffectLog {
  id: string;
  timestamp: string;
  toolName: string;
  arguments: Record<string, any>;
  authorized: boolean;
  notes: string;
}

const INITIAL_ACCOUNTS: Record<string, AccountRecord> = {
  'USR-1042': {
    id: 'USR-1042',
    name: 'Alex Mercer',
    email: 'alex.m@example.com',
    balance: 2450.0,
    role: 'USER',
    kycStatus: 'VERIFIED',
  },
  'USR-8821': {
    id: 'USR-8821',
    name: 'Sarah Chen',
    email: 'sarah.c@example.com',
    balance: 8120.0,
    role: 'USER',
    kycStatus: 'VERIFIED',
  },
  'ADMIN-001': {
    id: 'ADMIN-001',
    name: 'Platform Ops',
    email: 'ops@payvortex.internal',
    balance: 500000.0,
    role: 'ADMIN',
    kycStatus: 'VERIFIED',
  },
};

export class MockBankStore {
  private accounts: Record<string, AccountRecord> = JSON.parse(JSON.stringify(INITIAL_ACCOUNTS));
  private sideEffects: SideEffectLog[] = [];

  public reset(): void {
    this.accounts = JSON.parse(JSON.stringify(INITIAL_ACCOUNTS));
    this.sideEffects = [];
  }

  public getAccount(id: string): AccountRecord | undefined {
    return this.accounts[id];
  }

  public logSideEffect(toolName: string, args: Record<string, any>, authorized: boolean, notes: string): SideEffectLog {
    const entry: SideEffectLog = {
      id: `se-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      toolName,
      arguments: args,
      authorized,
      notes,
    };
    this.sideEffects.push(entry);
    return entry;
  }

  public getSideEffects(): SideEffectLog[] {
    return [...this.sideEffects];
  }

  public applyBalanceChange(accountId: string, amount: number): boolean {
    const acc = this.accounts[accountId];
    if (!acc) return false;
    acc.balance += amount;
    return true;
  }

  public setKycStatus(accountId: string, status: 'VERIFIED' | 'PENDING' | 'SUSPENDED'): boolean {
    const acc = this.accounts[accountId];
    if (!acc) return false;
    acc.kycStatus = status;
    return true;
  }
}

export const bankStore = new MockBankStore();

export function resetMockBankStore(): void {
  bankStore.reset();
}

export function getMockBankAccounts(): AccountRecord[] {
  return [
    bankStore.getAccount('USR-1042'),
    bankStore.getAccount('USR-8821'),
    bankStore.getAccount('ADMIN-001'),
  ].filter((acc): acc is AccountRecord => acc !== undefined);
}
