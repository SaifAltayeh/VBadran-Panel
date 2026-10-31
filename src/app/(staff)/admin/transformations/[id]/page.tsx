import { AdminTransformationForm } from "@/components/admin/views";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminTransformationForm id={Number(id)} />;
}
