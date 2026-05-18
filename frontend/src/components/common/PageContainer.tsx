import { cn } from "@/lib/cn";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("container-page section-padding", className)}>
      {children}
    </div>
  );
}


