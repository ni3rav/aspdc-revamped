import { Database } from 'lucide-react'

interface NoDataProps {
    title?: string
    message?: string
}

export default function NoData({
    title = 'no data found',
    message = 'this place is emptier than your git commits on weekends',
}: NoDataProps) {
    return (
        <div className="bg-background flex h-full min-h-[500px] w-full flex-col items-center justify-center p-8 md:min-h-[800px]">
            <Database className="text-muted-foreground mb-6 h-16 w-16" />
            <h3 className="text-foreground mb-3 text-2xl font-semibold">
                {title}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md text-center">
                {message}
            </p>
        </div>
    )
}
