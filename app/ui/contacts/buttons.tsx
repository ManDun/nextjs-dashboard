import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteContact } from '@/app/lib/actions';

export function DeleteContact({ id }: { id: string }) {
  const deleteContactWithId = deleteContact.bind(null, id);
  return (
    <form action={deleteContactWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
