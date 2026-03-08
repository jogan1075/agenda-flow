'use client';

import { getSession } from './session';

export function requireBusinessId() {
  const session = getSession();
  if (!session?.businessId) {
    throw new Error('No hay sesión activa');
  }
  return session.businessId;
}
