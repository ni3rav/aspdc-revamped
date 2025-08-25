import React from 'react'

export default function AdminPage() {
    return (
        <div className="flex h-full w-full items-center justify-center text-4xl">
            Please use this in desktop only and ensure to fill details properly
            since admin ui does not have validations
            <br />
            <span className="text-destructive ml-4">
                NOTE: UPDATING EVENT AND UPCOMING EVENT IS NOT WORKING SO TO
                MAKE CHANGES YOU HAVE TO DELETE AND RE-ADD
            </span>
        </div>
    )
}
