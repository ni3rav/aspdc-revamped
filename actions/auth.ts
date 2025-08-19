'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/supabase/server'
import { authSchema } from '@/validations/auth'

export async function login(formData: FormData) {
    const supabase = await createClient()

    let data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const parsedData = authSchema.safeParse(data)

    if (!parsedData.success) {
        redirect('/')
    }

    data = parsedData.data
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/admin')
}
