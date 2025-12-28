import { useSession } from '@tanstack/react-start/server';

type SessionUser = {
  userEmail: string;
  userID: string;
  isAdmin: boolean;
};

export function useAppSession() {
  return useSession<SessionUser>({
    password: 'a_password_a_password_a_password',
  });
}
