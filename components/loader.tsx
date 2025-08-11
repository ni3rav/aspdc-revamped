import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "loading..." }: LoaderProps) {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[800px] flex flex-col items-center justify-center bg-background p-8">
      <Loader2 className="size-14 animate-spin text-primary mb-6" />
      <h3 className="text-2xl font-medium text-foreground mb-6">{text}</h3>
    </div>
  );
}
