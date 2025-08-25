import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md">
                <SignIn
                    appearance={{
                        elements: {
                            footerAction: { display: 'none' },
                        },
                    }}
                    redirectUrl="/admin"
                />
            </div>
        </div>
    )
}
