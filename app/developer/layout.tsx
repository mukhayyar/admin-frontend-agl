import AdminTopNavLayout from '@/components/AdminTopNavLayout'

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <AdminTopNavLayout title="Developer Portal">{children}</AdminTopNavLayout>
}
