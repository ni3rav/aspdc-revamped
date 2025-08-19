import { Loader2 } from 'lucide-react'

interface LoaderProps {
    text?: string
}

export default function Loader({ text = 'loading...' }: LoaderProps) {
    return (
        <div className="bg-background flex h-full min-h-[500px] w-full flex-col items-center justify-center p-8 md:min-h-[800px]">
            <Loader2 className="text-primary mb-6 size-14 animate-spin" />
            <h3 className="text-foreground mb-6 text-2xl font-medium">
                {text}
            </h3>
        </div>
    )
}
