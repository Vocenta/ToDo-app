import React from 'react';
import { signInWithGoogle, signOutUser } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const GoogleAuthButton: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      {user ? (
        <div>
          <p>Bienvenido, {user.displayName}</p>
          <button onClick={signOutUser}>Cerrar sesión</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Iniciar sesión con Google</button>
      )}
    </div>
  );
};

export default GoogleAuthButton;