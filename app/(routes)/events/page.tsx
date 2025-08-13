'use client'

import ErrorState from '@/components/error-state'
import Loader from '@/components/loader'
import NoData from '@/components/no-data'
import { useEvents } from '@/hooks/useEvents'
import { EventsResponse } from '@/lib/types'

export default function EventsPage() {
    const { data, isLoading, isError } = useEvents()

    if (isLoading) {
        return <Loader />
    }

    if (data?.length === 0) {
        return <NoData />
    }

    if (isError || !data) {
        return <div className="p-6 text-red-500">Failed to load projects.</div>
    }

    const eventsData: EventsResponse = data
    //TODO: remove this once used, lint marker for now
    console.log(eventsData)

    return (
        <>
            <Loader />
            <NoData />
            <ErrorState />
        </>
    )
}
