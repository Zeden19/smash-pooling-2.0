"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
}

function EditCarpoolButton({ id }: Props) {
  const router = useRouter();
  return <Button onClick={() => router.push(`/carpool/edit/${id}`)}>Edit Carpool</Button>;
}

export default EditCarpoolButton;