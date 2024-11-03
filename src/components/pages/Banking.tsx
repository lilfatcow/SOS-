import { BankAccountList } from '@/components/banking/BankAccountList';

export function Banking() {
  return (
    <div className="px-8 py-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-xl font-medium mb-6">Banking Connections</h1>
        <BankAccountList />
      </div>
    </div>
  );
}