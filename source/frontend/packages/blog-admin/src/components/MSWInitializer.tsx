'use client';

import { useEffect } from 'react';

export function MSWInitializer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (async () => {
        const { mockApiForClient } = await import('@/apiMocks/serverForClient');
        mockApiForClient.start();
      })();
    }
  }, []);

  return null;
}
