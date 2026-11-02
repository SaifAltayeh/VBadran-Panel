import { AdminExerciseForm } from "@/components/admin/member-portal";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminExerciseForm id={Number(id)} />;
}
