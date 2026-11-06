import { AdminClientForm } from "@/components/admin/views";

export default async function AdminClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminClientForm id={Number(id)} />;
}
