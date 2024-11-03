import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="h-full w-full flex bg-[#F5F5F7]">
      <div className="w-[240px] flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full">
        <Header />
        <ScrollArea className="flex-1">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}