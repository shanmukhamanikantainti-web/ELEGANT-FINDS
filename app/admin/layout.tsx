import AdminClient from './AdminClient'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminClient>{children}</AdminClient>
}