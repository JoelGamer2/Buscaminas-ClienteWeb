import Cookies from 'js-cookie';
import { useEffect, useState } from 'react'

export default function MiCuenta({ nombreJugador, ip }: { nombreJugador: string, ip: string }) {

  const [pagina, setPagina] = useState("");

  const cargarPerfil = async () => {
    try {
      const response = await fetch(`${ip}/cuenta/perfil/${nombreJugador}`, {
        headers: {
          'Authorization': Cookies.get("auth") as string
        }
      });
      const data = await response.text();
      setPagina(data);
    } catch (error) {
      console.error('Error al obtener la pagina:', error);
    }
  };
  useEffect(() => { cargarPerfil(); }, []);



  const cerrarSesion = () => {
    Cookies.remove("jugador");
    Cookies.remove("auth");
    window.location.reload();
  }

  return (
    <div id='contenido'>
      <div className='statsContenedor'>
        <div dangerouslySetInnerHTML={{ __html: pagina }}>
        </div>
        <button onClick={cerrarSesion}> Cerrar Sesion</button>
      </div>
    </div>
  )
}
