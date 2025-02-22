'use client';

import { useEffect } from 'react';

export function MSWInitializer() {
  useEffect(() => {
    (async () => {
      const { setupProtTypeMockApiForClient } = await import(
        'shared-interface-adapter/src/apiMocks/serverForClient'
      );
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }
      const mockApiForClient = setupProtTypeMockApiForClient(
        process.env.NEXT_PUBLIC_API_URL,
      );
      mockApiForClient.start();
    })();
  }, []);

  return null;
}
