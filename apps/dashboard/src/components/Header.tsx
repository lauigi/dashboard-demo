import { Link, useNavigate, useRouteContext } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { LogIn, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({});
  const { user } = useRouteContext({ from: '__root__' });
  const navigate = useNavigate();
  return (
    <>
      <header className="py-1 px-4 sticky top-0 z-50 w-full flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold mr-auto">
          <Link to="/">Another Dashboard</Link>
        </h1>
        {user && (
          <>
            <h2 className="mr-4">{user.email}</h2>
            <Button
              onClick={() => {
                navigate({ to: '/logout' });
              }}
            >
              <LogOut size={24} />
            </Button>
          </>
        )}
        {!user && (
          <Button
            onClick={() => {
              navigate({
                to: '/login',
                search: {
                  redirect: location.href,
                },
              });
            }}
          >
            <LogIn size={24} />
            Login
          </Button>
        )}
      </header>
    </>
  );
}
