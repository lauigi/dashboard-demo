import { Link, useNavigate, useRouteContext } from '@tanstack/react-router';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { LogIn, LogOut } from 'lucide-react';

export default function Header() {
  const { user } = useRouteContext({ from: '__root__' });
  const navigate = useNavigate();
  return (
    <>
      <header className="py-1.5 px-4 sticky top-0 z-50 w-full flex items-center dark:bg-gray-200 dark:text-gray-800 bg-gray-800 text-white shadow-lg">
        <h1 className="ml-4 text-sm sm:text-xl font-semibold mr-auto">
          <Link to="/">Another Dashboard</Link>
        </h1>
        {user && (
          <>
            <h2 className="mr-4">
              {user.isAdmin && (
                <Badge variant="destructive" className="mr-1">
                  Admin
                </Badge>
              )}
              {user.email}
            </h2>
            <Button
              onClick={() => {
                navigate({ to: '/logout' });
              }}
            >
              <LogOut />
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
            <LogIn />
            Login
          </Button>
        )}
      </header>
    </>
  );
}
