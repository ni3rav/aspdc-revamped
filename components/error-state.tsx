import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
    title?: string
    message?: string
}

export default function ErrorState({
    title = 'oops! something broke',
    message = 'our code is having an existential crisis',
}: ErrorStateProps) {
    return (
        <div className="bg-background flex h-full min-h-[450px] w-full flex-col items-center justify-center p-8 md:min-h-[800px]">
            <AlertTriangle className="text-destructive mb-6 h-16 w-16" />
            <h3 className="text-foreground mb-3 text-2xl font-semibold">
                {title}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md text-center">
                {message}
            </p>
        </div>
    )
}
