import SidebarLayout from '@/components/SidebarLayout'

export default function IviLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>
}
