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
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'],
        { invalid_type_error: 'Please select an invoice status.', }),
    date: z.string({
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

const CreateInvoice = InvoiceFormSchema.omit({ id: true });
const UpdateInvoice = InvoiceFormSchema.omit({ id: true });

const CreateCustomer = CustomerFormSchema.omit({ id: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        name?: string[];
        date?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {

    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        date: formData.get('invoicedate'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, date, status } = validatedFields.data;
    const amountInCents = amount * 100;
    // const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}


export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        date: formData.get('date'),
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

    const { customerId, amount, date, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, date = ${date}
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

    // Prepare data for insertion into the database
    const { name, email } = validatedFields.data;
    const image_url = '/customers/amy-burns.png'
    const date = new Date().toISOString().split('T')[0];

    try {
        console.log('Inserting customer data into database.' + { name })
        await sql`
          INSERT INTO customers (name, email, date, image_url)
          VALUES (${name}, ${email}, ${date}, ${image_url})
        `;
    } catch (error) {
        console.log('Error, database failed while creating customer. ' + { error })
        return {
            message: 'Database Error: Failed to Create Customer.',
        };
    }

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

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
    throw new Error('Failed to Delete Customer');

    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
        return { message: 'Deleted Customer.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Customer.' };
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