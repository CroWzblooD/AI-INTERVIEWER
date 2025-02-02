'use client';

import dynamic from 'next/dynamic';

// Dynamically import Interview component with no SSR
const Interview = dynamic(() => import('./Interview'), {
  ssr: false,
  loading: () => null
});

export default function Page() {
  return <Interview />;
}
