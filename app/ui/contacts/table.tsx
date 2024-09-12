import { DeleteContact } from '@/app/ui/contacts/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredContacts } from '@/app/lib/data';

export default async function ExpensesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const contacts = await fetchFilteredContacts(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
          <div className="md:hidden">
            {contacts?.map((contact) => (
              <div
                key={contact.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{contact.first_name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{contact.last_name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-medium">
                      {contact.comments}
                    </p>
                    <p>{formatDateToLocal(contact.created)}</p>

                  </div>
                  <div className="flex justify-end gap-2">
                    <DeleteContact id={contact.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Comments
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {contacts?.map((contact) => (
                <tr
                  key={contact.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{contact.first_name} {contact.last_name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {contact.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {contact.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(contact.created)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {contact.comments}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <DeleteContact id={contact.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
