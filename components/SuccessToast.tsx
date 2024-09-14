import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

function SuccessToast(title: string, description?: string) {
  return toast({
    title: (
      <>
        <CheckCircle /> {title}
      </>
    ),
    description,
    variant: "success",
  });
}

export default SuccessToast;
