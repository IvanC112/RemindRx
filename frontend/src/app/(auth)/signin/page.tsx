'use client';

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signin } from './actions';
import { toast } from "sonner";
import { useAuth } from "@/app/providers/authprovider";

export default function Signin() {
    const [state, action, isPending] = useActionState(signin, undefined);
    const router = useRouter();
    const { refreshAuthState } = useAuth();

    useEffect(() => {
        if (state?.success) {
            toast.success("Signed in successfully!");
            refreshAuthState().then(() => {
                router.push('/home');
            });
        } else if (state?.message) {
            toast.error(state.message);
        }
    }, [state, router, refreshAuthState]);


    return (
        <> 
            <div className="flex justify-center items-center content-center h-screen mx-10">
                <div className="w-full max-w-sm p-4 bg-white border border-indigo-500/40 rounded-lg shadow-lg sm:p-6 md:p-8">
                    <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign In</h1>

                    <form className='flex flex-col mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-3' action={action}>
                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="email">Email</label>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            placeholder='Enter your email'
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {state?.errors?.email && (
                            <div className="text-red-400">
                                {state.errors.email}
                            </div>)}
                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="password">Password</label>
                        <input 
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {state?.errors?.password && (
                        <div className="text-red-400">
                            {state.errors.password}
                        </div>)}
                        
                        <div>
                            <button className='mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' type='submit' disabled={isPending}>
                                {isPending ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                        
                        <p className="mt-2 text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}