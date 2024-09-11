'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
    }),
    status: z.enum(['pending', 'paid'],
        { invalid_type_error: 'Please select an invoice status.', }),
    invoice_date: z.string({
        required_error: "Date is required",
    }),
});

const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Invalid Email.",
    })
});

const ExpenseFormSchema = z.object({
    id: z.string(),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    type: z.string({
        required_error: "Type is required",
        invalid_type_error: "Type must be a string",
    }),
    expense_date: z.string({
        required_error: "Date is required",
    }),
    comments: z.string()
});

const CreateInvoice = InvoiceFormSchema.omit({ id: true });
const UpdateInvoice = InvoiceFormSchema.omit({ id: true });

const CreateCustomer = CustomerFormSchema.omit({ id: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true });

const CreateExpense = ExpenseFormSchema.omit({ id: true });
const UpdateExpense = ExpenseFormSchema.omit({ id: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        name?: string[];
        invoice_date?: string[];
        type?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {

    console.log("Inside function to create invoice")

    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: Number(formData.get('amount')),
        invoice_date: formData.get('invoicedate'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        console.error("Field level validation failed.")
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, invoice_date, status } = validatedFields.data;
    const amountInCents = amount * 100;
    // const date = new Date().toISOString().split('T')[0];

    console.log('Fields valid, updating database...')

    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status, invoice_date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${invoice_date})
        `;
    } catch (error: any) {
        console.error("An error Occured: ", error.message);
        return {

            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    console.info("Invoice created.")

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}


export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: Number(formData.get('amount')),
        invoice_date: formData.get('date'),
        status: formData.get('status'),
    });

    console.log('Inside updateInvoice, validating fields....')

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    console.log('Fields valid, updating database...')

    const { customerId, amount, invoice_date, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, invoice_date = ${invoice_date}
          WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

// Customers
export async function createCustomer(prevState: State, formData: FormData) {

    console.log('Creating Customer.....')

    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email')
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        console.log('Missing fields, validation failed.')
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.',
        };
    }

    console.log('Fields valid, updating database...')

    // Prepare data for insertion into the database
    const { name, email } = validatedFields.data;
    const image_url = '/customers/amy-burns.png'
    // const date = new Date().toISOString().split('T')[0];

    try {
        console.log('Inserting customer data into database.' + { name })
        await sql`
          INSERT INTO customers (name, email, image_url)
          VALUES (${name}, ${email}, ${image_url})
        `;
    } catch (error) {
        console.log('Error, database failed while creating customer. ' + { error })
        return {
            message: 'Database Error: Failed to Create Customer.',
        };
    }

    console.info('Customer created.')

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}


export async function updateCustomer(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email')
    });

    console.log('Data fetched, validating....')

    if (!validatedFields.success) {
        console.log('Data Invalid.')
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Customer.',
        };
    }

    console.log('Fields valid, updating database...')

    const { name, email } = validatedFields.data;

    try {
        await sql`
          UPDATE customers
          SET name = ${name},
          email = ${email}
          WHERE id = ${id}
        `;
    } catch (error) {
        console.log('Error occurred updating data.' + error)
        return { message: 'Database Error: Failed to Update Customer.' };
    }

    console.info('Customer updated.')

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {

    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
        return { message: 'Deleted Customer.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Customer.' };
    }
}


// Expenses
export async function createExpense(prevState: State, formData: FormData) {

    console.log('Creating Expense.....' + formData.get('comments'))

    const validatedFields = CreateExpense.safeParse({
        name: formData.get('name'),
        type: formData.get('type'),
        amount: Number(formData.get('amount')),
        expense_date: formData.get('expense_date'),
        comments: formData.get('comments')
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        console.log('Missing fields, validation failed.')
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Expense.',
        };
    }

    console.log('Fields valid, updating database...')

    // Prepare data for insertion into the database
    const { name, type, amount, expense_date, comments } = validatedFields.data;
    console.log('Comments: ' + `${comments}`, `${name}`, `${type}`)
    // const date = new Date().toISOString().split('T')[0];
    const amountInCents = amount * 100;

    try {
        console.log('Inserting expense data into database.' + `${amountInCents}`)
        await sql`
          INSERT INTO expenses (name, type, amount, expense_date, comments)
          VALUES (${name}, ${type}, ${amountInCents}, ${expense_date}, ${comments})
        `;
    } catch (error: any) {
        console.error("An error Occured: ", error.message);
        return {
            message: 'Database Error: Failed to Create Expense.',
        };
    }

    console.info('Expense created.')

    revalidatePath('/dashboard/expenses');
    redirect('/dashboard/expenses');
}


export async function updateExpense(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateExpense.safeParse({
        name: formData.get('name'),
        type: formData.get('type'),
        amount: Number(formData.get('amount')),
        expense_date: formData.get('expense_date'),
        comments: formData.get('comments')
    });

    console.log('Data fetched, validating....')

    if (!validatedFields.success) {
        console.log('Data Invalid.')
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Expense.',
        };
    }

    console.log('Fields valid, updating database...')

    const { name, type, amount, expense_date, comments } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
          UPDATE expenses
          SET name = ${name},
          type = ${type},
          amount = ${amountInCents},
          expense_date = ${expense_date},
          comments = ${comments}
          WHERE id = ${id}
        `;
    } catch (error: any) {
        console.error('Error occurred updating data.', error.message)
        return { message: 'Database Error: Failed to Update Expense.' };
    }

    console.info('Expense updated.')

    revalidatePath('/dashboard/expenses');
    redirect('/dashboard/expenses');
}

export async function deleteExpense(id: string) {

    try {
        await sql`DELETE FROM expenses WHERE id = ${id}`;
        revalidatePath('/dashboard/expenses');
        return { message: 'Deleted Expense.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Expense.' };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}