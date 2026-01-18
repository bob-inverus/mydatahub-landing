import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Keys | MySanctum',
  description: 'Manage your API keys for programmatic access to MySanctum',
  openGraph: {
    title: 'API Keys | MySanctum',
    description: 'Manage your API keys for programmatic access to MySanctum',
    type: 'website',
  },
};

export default async function APIKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
