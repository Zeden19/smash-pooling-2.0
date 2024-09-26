import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  children: ReactNode;
  toolTipText: string;
}

function GenericToolTip({ children, toolTipText }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{toolTipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default GenericToolTip;
