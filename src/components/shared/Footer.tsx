import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <div
      className={cn(
        'mt-16 flex w-full max-w-md flex-col items-center border-gray-200 border-t pt-8 text-center text-[#1b3b2c]',
        className,
      )}
    >
      <div className="mb-8 flex gap-6 text-[#1b3b2c]">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-emerald-700"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-emerald-700"
        >
          <FaTiktok size={24} />
        </a>
      </div>
      <p className="font-medium text-gray-500 text-xs">
        © 2026 Bella Affiliate. Travelling Experience.
      </p>
    </div>
  );
}
