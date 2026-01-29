'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { RegisterForm } from '@/components/RegisterForm'
import { ArrowRight } from 'lucide-react'

export function RegisterModal() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="group bg-muted/50 hover:border-primary/50 hover:bg-muted cursor-pointer rounded-lg border p-6 transition-all">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                                Want to add your name to the leaderboard?
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Register now and compete with other coders
                            </p>
                        </div>
                        <Button size="sm" className="shrink-0">
                            Register Now
                            <ArrowRight className="mr-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register for Leaderboard</DialogTitle>
                    <DialogDescription>
                        Enter your Codeforces handle to join the leaderboard.
                        LeetCode username is optional (we currently collect it
                        for future use as there's no official API).
                    </DialogDescription>
                </DialogHeader>
                <RegisterForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
