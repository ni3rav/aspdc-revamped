import { Database } from "lucide-react";

interface NoDataProps {
  title?: string;
  message?: string;
}

export default function NoData({
  title = "no data found",
  message = "this place is emptier than your git commits on weekends",
}: NoDataProps) {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[800px] flex flex-col items-center justify-center bg-background p-8">
      <Database className="w-16 h-16 text-muted-foreground mb-6" />
      <h3 className="text-2xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        {message}
      </p>
    </div>
  );
}
