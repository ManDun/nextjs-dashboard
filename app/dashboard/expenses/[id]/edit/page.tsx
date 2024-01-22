import Form from '@/app/ui/expenses/edit-form';
import Breadcrumbs from '@/app/ui/expenses/breadcrumbs';
import { fetchExpenseById } from '@/app/lib/data';
import { updateExpense } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Expense Details',
};

export default async function Page({ params }: { params: { id: string } }) {

    const id = params.id;
    console.log('Inside edit expenses page with id: ' + id)
    const [expenses] = await Promise.all([
        fetchExpenseById(id),
    ]);

    if (!expenses) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Expenses', href: '/dashboard/expenses' },
                    {
                        label: 'Edit Expense',
                        href: `/dashboard/expenses/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form expenses={expenses} />
        </main>
    );
}