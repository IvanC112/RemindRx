'use server';

import { SignupFormSchema } from "@/lib/formSchemas";

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup (state: any, formData: FormData) {

    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get('email'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    const supabase = await createClient();

    const response = await supabase.auth.signUp( {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    });

    if (response.error) console.error(response.error) 

    const userId = response.data.user?.id;

    const { error } = await supabase.from('users').insert({
        auth_id: userId, 
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
    });
    
    if (error) {console.error(error)} else {redirect('/home')}
}