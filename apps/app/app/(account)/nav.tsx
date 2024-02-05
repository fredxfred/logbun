'use client';

import { DropdownMenu, Logo } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Gravatar from 'react-gravatar';
import { toast } from 'sonner';

const settings = [
  { name: 'Projects', href: '/projects' },
  { name: 'Profile', href: '/settings/profile' },
  // { name: 'Billing', href: '/billing' },
];

interface Props {
  name: string;
  email: string;
}

export default function Nav({ name, email }: Props) {
  const router = useRouter();

  const handleSignOut = async () => {
    const id = toast.loading('Signing out...');

    try {
      await signOut({ redirect: false });
      router.refresh();
      toast.dismiss(id);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between h-16 container-lg">
        <Link className="flex outline-none focus:outline-none" href="/projects">
          <Logo className="w-auto h-8" />
        </Link>

        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button className="inline-flex p-2 -mr-2 space-x-3 text-base font-normal focus:outline-none">
              <span className="truncate">{email}</span>
              <Gravatar className="rounded-full w-7 h-7" rating="pg" default="retro" email={email} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-60" align="end" forceMount>
            <DropdownMenu.Label className="font-normal">
              <p className="text-base font-medium truncate">{name}</p>
              <p className="text-sm text-gray-500 truncate">{email}</p>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              {settings.map((item) => (
                <DropdownMenu.Item key={item.name} asChild>
                  <Link href={item.href}>{item.name}</Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item asChild>
              <button type="button" className="w-full text-red-500" onClick={handleSignOut}>
                Sign out
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </nav>
  );
}
