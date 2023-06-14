import Cookies from 'js-cookie';
import { sha512 } from 'js-sha512';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


export const InicioSesion = ({ ip }: { ip: string }) => {
  const [nombre, setNombre] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [clave, setClave] = useState("-1");
  const [error, setError] = useState("");
  const [registrar, setRegistrar] = useState(false);
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    if (nombre === "" || clave === "") {
      setError("No puede haber inputs vacios");
    } else {
      const enviarCredenciales = await fetch(`${ip}/cuenta/iniciar/${nombre}/${clave}`);
      const respuesta = await enviarCredenciales.json();
      console.log(respuesta);
      if (respuesta.estado == true) {
        Cookies.set("jugador", nombre);
        Cookies.set("auth", respuesta.auth);
        navigate("/micuenta");
        window.location.reload();
      } else {
        setError("Credenciales no validas");
      }
    }
  }

  const iniciarRegistro = async () => {
    const patronCorreo = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (patronCorreo.test(correoElectronico)) {
      if (nombre === "" || clave === "") {
        setError("No puede haber inputs vacios");
      } else {
        const enviarCredenciales = await fetch(`${ip}/cuenta/registrar/${nombre}/${correoElectronico}/${clave}`);
        const respuesta = await enviarCredenciales.json();
        console.log(respuesta);
        if (respuesta.estado == true) {
          //Si se pudo registrar con exito se inicia sesion con esas credenciales.
          iniciarSesion();
        } else {
          setError("Este usuario ya existe.");
        }
      }
    } else {
      setError("Correo Electronico Invalido");
    }
  }

  const iniciarSolicitudCambioClave = async () => {

    if (nombre === "") {
      setError("Debes Escribir el Nombre para poder empezar la solicitud de cambio de Contraseña.");
    } else {
      const enviarSolicitud = await fetch(`${ip}/cuenta/solicitudCambioClave/${nombre}`);
      const respuesta = await enviarSolicitud.json();
      if(respuesta?.status == undefined)
       setError("Comprueba tu Correo Electronico");
      else
      setError(respuesta?.descripcion);
      console.log(respuesta?.status);
    }


  }

  return (
    <div id='contenido'>
      <div id='formulario'>

        <br />
        <label htmlFor="nombre" id='labelNombre'>Nombre de Usuario:
          <input type="text" name="nombre" id="nombre" onChange={(event) => setNombre(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1).toLowerCase())} />
        </label>
        <br />

        {registrar ? (<label htmlFor="correo" id='labelCorreo'>Correo Electronico:
          <input type="email" name="correo" id="correo" onChange={(event) => setCorreoElectronico(event.target.value.toLowerCase())} />
        </label>) : ""}
        <br />
        <label htmlFor="clave" id="labelClave">Contraseña:

          <input type="password" name="clave" id="clave" onKeyDown={(event) => {
            if (event.key === 'Enter')
              iniciarSesion();
          }}
            onChange={(event) => setClave(sha512(event.target.value))}
          />
          <br />
        </label>

        <label htmlFor="registrar">Registrar
          <input type="checkbox" name="registrar" id="registrar" onChange={(event) => setRegistrar(event.target.checked)} />
        </label>

        {registrar ? <button className='botonSubmmit' onClick={iniciarRegistro}>Registrar</button> : <button className='botonSubmmit' onClick={iniciarSesion}>Iniciar Sesion</button>}
        <br />
        <p className='enlaceOlvidarClave' onClick={iniciarSolicitudCambioClave}>¿Olvidaste tu Contraseña?</p>
        <p className='errores'>{error}</p>
        {/* {nombre + " " + clave + " " + registrar} */}
      </div>
    </div>
  )
}
