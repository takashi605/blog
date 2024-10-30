'use client';

import { useEffect } from 'react';

export function MSWInitializer() {
  useEffect(() => {
    (async () => {
      const { mockApiForClient } = await import('@/apiMocks/serverForClient');
      mockApiForClient.start();
    })();
  }, []);

  return null;
}
