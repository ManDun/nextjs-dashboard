import { CreditCardIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className="flex flex-row items-center leading-none text-white"
    >
      <p className="text-[44px]">MyFin</p>
      <CreditCardIcon className="h-12 w-12" />
    </div>
  );
}
