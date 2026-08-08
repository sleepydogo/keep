import { useEffect, useState } from 'react';
import { guardarRol, leerRol, type Rol } from '@/services/rol';

export function useRol() {
  const [rol, setRolState] = useState<Rol>('holder');

  useEffect(() => {
    leerRol().then((r) => r && setRolState(r));
  }, []);

  const setRol = async (r: Rol) => {
    await guardarRol(r);
    setRolState(r);
  };

  return { rol, setRol };
}
