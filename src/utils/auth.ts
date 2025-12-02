import { useUser } from '@clerk/clerk-react';

export const useIsAdmin = (): { isAdmin: boolean; isLoading: boolean } => {
  const { isLoaded, user } = useUser();
  
  if (!isLoaded) {
    return { isAdmin: false, isLoading: true };
  }

  const userRole = user?.publicMetadata?.role;
  return { isAdmin: userRole === 'admin', isLoading: false };
};

export const checkIsAdmin = (user: any): boolean => {
  return user?.publicMetadata?.role === 'admin';
};
