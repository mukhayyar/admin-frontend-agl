import AdminTopNavLayout from '@/components/AdminTopNavLayout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminTopNavLayout>{children}</AdminTopNavLayout>
}
