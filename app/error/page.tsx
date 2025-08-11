import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="text-6xl font-mono text-muted-foreground mb-4">
            oops!
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            something went wrong
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">maybe retry ?</p>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="ghost" className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                return home{" "}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
