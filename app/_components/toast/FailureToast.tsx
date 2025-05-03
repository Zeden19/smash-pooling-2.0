import { toast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";

function FailureToast(title: String, description?: String) {
  return toast({
    title: (
      <>
        <XCircle /> {title}
      </>
    ),
    description,
    variant: "destructive",
  });
}

export default FailureToast;
