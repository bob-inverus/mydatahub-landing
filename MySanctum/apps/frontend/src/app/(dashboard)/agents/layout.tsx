import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Worker Conversation | MySanctum',
  description: 'Interactive Worker conversation powered by MySanctum',
  openGraph: {
    title: 'Worker Conversation | MySanctum',
    description: 'Interactive Worker conversation powered by MySanctum',
    type: 'website',
  },
};

export default async function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
