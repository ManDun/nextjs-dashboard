import Form from '@/app/ui/expenses/create-form';
import Breadcrumbs from '@/app/ui/expenses/breadcrumbs';
import { fetchExpenses } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Expense',
};

export default async function Page() {
    const expenses = await fetchExpenses();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Expenses', href: '/dashboard/expenses' },
                    {
                        label: 'Create Expense',
                        href: '/dashboard/expenses/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}