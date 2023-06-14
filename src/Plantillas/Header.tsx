import { useEffect } from 'react'
import Cookies from 'js-cookie';

export const Header = () => {
useEffect(()=>{
  //SI 1 DE LAS 2 COOKIES SE BORRA, SE CERRARA SESION AUTOMATICAMENTE PARA EVITAR ERRORES.
  if( Cookies.get("auth") == null && Cookies.get("jugador") != null){
    Cookies.remove("jugador");
    Cookies.remove("auth");
    window.location.reload();
  }

  if( Cookies.get("auth") != null && Cookies.get("jugador") == null){
    Cookies.remove("jugador");
    Cookies.remove("auth");
    window.location.reload();
  }
},[]);


  return (
    <header>
        <p id='titulo'>BUSCAMINAS</p>
      <div className="nav-container">
        <ul className="nav">
          <li><a href="/">Inicio</a></li>
          <li><a href="/ranking">Ranking</a></li>
          <li><a href="/micuenta">MiCuenta</a></li>
          <li><a href="/buscaminas">Jugar</a></li>
        </ul>
      </div>

    </header>
  )
}
