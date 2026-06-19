import { createFileRoute } from '@tanstack/react-router';
import { FaGoogle, FaInstagram } from 'react-icons/fa';
import { LoginForm } from '../features/auth/index.ts';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-6 flex gap-4">
        <div className="flex items-center gap-2 rounded border bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm">
          <FaInstagram className="text-2xl text-pink-600" />
          Instagram
        </div>
        <div className="flex items-center gap-2 rounded border bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm">
          <FaGoogle className="text-2xl text-blue-500" />
          Google
        </div>
      </div>
      <LoginForm />
    </div>
  );
}
