// app/verify/page.tsx
import { db } from '@/db/drizzle'
import { certificates } from '@/db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

type Params = {
    token: string
}

export default async function VerifyPage({
    params,
}: {
    params: Promise<Params>
}) {
    const resolvedParams = await params
    const { token } = resolvedParams

    if (!token) {
        return (
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-2 text-2xl font-semibold">
                    Certificate Verification
                </h1>
                <p className="text-red-600">Missing token.</p>
            </div>
        )
    }

    // Hash the token with SHA-256
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Find certificate by hashed token
    const [record] = await db
        .select()
        .from(certificates)
        .where(eq(certificates.token, tokenHash))
        .limit(1)

    if (!record) {
        return (
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-2 text-2xl font-semibold">
                    Certificate Verification
                </h1>
                <p className="text-red-600">
                    Invalid or forged certificate. No matching record was found.
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl p-6">
            <h1 className="mb-4 text-2xl font-semibold">
                Certificate Verification
            </h1>
            <p className="text-lg">
                This certificate was issued to participant{' '}
                <span className="font-semibold">{record.participantName}</span>{' '}
                for satisfactorily participating in event{' '}
                <span className="font-semibold">{record.eventName}</span> that
                took place on{' '}
                <span className="font-semibold">
                    {record.eventDate.toLocaleDateString()}
                </span>
                . In case of any discrepancy with the name on the certificate,
                consider it forged.
            </p>
        </div>
    )
}
