import { AlertTriangle, Bug } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
}

export default function ErrorState({
  title = "oops! something broke",
  message = "our code is having an existential crisis",
}: ErrorStateProps) {
  return (
    <div className="w-full h-full min-h-[450px] md:min-h-[800px] flex flex-col items-center justify-center bg-background p-8">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
      <h3 className="text-2xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        {message}
      </p>
    </div>
  );
}
