'use client';

import { useMemo } from 'react';
import { getSession } from './session';

export function useBusinessId() {
  const businessId = useMemo(() => getSession()?.businessId ?? '', []);
  return businessId;
}
