// route-guard.tsx
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode} from 'react';
import { useUserActive } from '../../app/login/page';

interface RouteGuardProps {
    children: ReactNode;
  }

function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const userActive = useUserActive();

  useEffect(() => {
    console.log("guard %d", userActive);
    if (userActive === 0) {
      router.push('/deactivated');
    }
  }, [userActive, router]);

  return children;
}

export default RouteGuard;
