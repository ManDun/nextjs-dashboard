'use client';

import { useFormState } from 'react-dom';
import { ExpenseField } from '@/app/lib/definitions';
import {
  IdentificationIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateExpense } from '@/app/lib/actions';

export default function EditExpenseForm({
  expenses
}: {
  expenses: ExpenseField;

}) {
  const initialState = { message: "", errors: {} };
  const updateExpenseWithId = updateExpense.bind(null, expenses.id);
  const [state, dispatch] = useFormState(updateExpenseWithId, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Expense Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Expense Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={expenses.name}
                required
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Type */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Type
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="type"
                name="type"
                type="text"
                defaultValue={expenses.type}
                required
                placeholder="Enter type"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <ClipboardDocumentListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Expense Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={expenses.amount}
                required
                placeholder="Enter AUD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Expense Date */}
        <div className="mb-4">
          <label htmlFor="expense_date" className="mb-2 block text-sm font-medium">
            Choose a Date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="expense_date"
                name="expense_date"
                type="date"
                defaultValue={expenses.expense_date}
                required
                // placeholder="Enter AUD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-4">
          <label htmlFor="comments" className="mb-2 block text-sm font-medium">
            Comments
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="comments"
                name="comments"
                rows={1}
                defaultValue={expenses.comments}
                required
                placeholder="Enter coments"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/expenses"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Expense</Button>
      </div>
    </form>
  );
}
