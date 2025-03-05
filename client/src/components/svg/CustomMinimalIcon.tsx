import { Rainbow } from 'lucide-react';
import { cn } from '~/utils';

export default function CustomMinimalIcon({
  size = 25,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Rainbow
      size={size}
      className={className}
    />
  );
}

