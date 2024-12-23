import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import GoogleAuthButton from '../AccountSection/GoogleAuthButton';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return (
      <div>
        <p>Por favor, inicia sesión para continuar.</p>
        <GoogleAuthButton />
      </div>
    );
  }

  return <>{children}</>;
};

export {};

export default RequireAuth;