import { AdminWorkoutForm } from "@/components/admin/member-portal";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminWorkoutForm id={Number(id)} />;
}
