'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OctagonAlertIcon } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const SignInViews = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      // Assuming result contains an `error` field if login fails
      if (result?.error) {
        setError(result.error.message ?? 'An unknown error occurred');
        return;
      }

      // Login successful
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center'>
                  <h1 className='text-2xl font-bold'>Welcome Back!</h1>
                  <p className='text-muted-foreground text-balance'>Login to your account</p>
                </div>

                {/* Email Field */}
                <div className='grid grid-gap-3'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter your email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Field */}
                <div className='grid grid-gap-3'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter your password' type='password' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Error Alert */}
                {!!error && (
                  <Alert className='bg-destructive/10 border-none'>
                    <OctagonAlertIcon className='h-4 w-4 !text-destructive' />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                {/* Divider */}
                <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                  <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                    Or continue with
                  </span>
                </div>

                {/* OAuth Buttons */}
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='outline' className='w-full'>
                    <img src='/google.svg' alt='google logo' className='h-4 w-4 mr-2' />
                    Google
                  </Button>
                  <Button variant='outline' className='w-full'>
                    <img src='/github.svg' alt='github logo' className='h-4 w-4 mr-2' />
                    GitHub
                  </Button>
                </div>

                {/* Link to Sign Up */}
                <div className='text-center text-sm'>
                  Don&apos;t have an account?{' '}
                  <Link href='/sign-up' className='underline underline-offset-4'>
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          {/* Right Section (Only visible on md and above) */}
          <div className='bg-radial from-green-700 to-green-800 relative hidden md:flex flex-col gap-y-4 items-center justify-center'>
            <img src='/logo.svg' alt='main logo' className='h-[92px] w-[92px]' />
            <p className='text-2xl text-white font-semibold'>Meet.AI</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInViews;
