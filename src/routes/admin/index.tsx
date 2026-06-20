import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="mt-20 grid w-full max-w-md grid-cols-1 gap-4 sm:max-w-2xl sm:grid-cols-2">
      <Link to="/admin/penginapan" className="w-full">
        <Button 
          className="h-auto w-full rounded-xl border border-[#1b3b2c] bg-transparent px-6 py-10 text-center font-semibold text-lg text-[#1b3b2c] shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1b3b2c]/5"
        >
          🏨 Kelola Penginapan
        </Button>
      </Link>
      <Link to="/admin/spill-link" className="w-full">
        <Button 
          className="h-auto w-full rounded-xl border border-[#1b3b2c] bg-transparent px-6 py-10 text-center font-semibold text-lg text-[#1b3b2c] shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1b3b2c]/5"
        >
          🔗 Kelola Spill Link
        </Button>
      </Link>
    </div>
  );
}
