import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
};

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-center rounded-lg bg-teal-500 p-3 md:h-36 justify-center">
                    <div className="w-auto text-white md:w-auto">
                        <AcmeLogo />
                    </div>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}