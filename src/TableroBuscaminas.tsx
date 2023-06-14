import Cookies from 'js-cookie';
import { MouseEventHandler, useEffect, useState } from 'react';
import { Afijos } from './Afijos';

export const TableroBuscaminas = ({ nombreJugador, ip, espectador }: { nombreJugador: string, ip: string, espectador: boolean }) => {
  const [mostrarTablero, setMostrarTablero] = useState(false);
  type Estado = { dimensiones: string, gameover: boolean, victoria: boolean, casillas: [], numBanderasRestantes: number };
  const [estados, setEstados] = useState<Estado>();
  const [dimensionesCrear, setDimensionesCrear] = useState(0);
  const [dificultad, setDificultad] = useState("FACIL");
  const [error, setError] = useState("");
  const [estadoBotonMovil, setEstadoBotonMovil] = useState("💣");
  const [poupVictoria, setPopupVictoria] = useState(false);
  const cargarPartidaApi = async () => {
    try {
      const response = await fetch(`${ip}/partidas/cargar/${nombreJugador}`);
      const data = await response.json();
      setPopupVictoria(data.victoria);
      if (data.dificultad != null) {
        setDificultad(data.dificultad);
        setDimensionesCrear(data.dimensiones);
      }
      setEstados(data);
    } catch { 

    }
  };
  useEffect(() => {
    if (espectador || dificultad == "EXTREMO_PLUS") {
      const intervalo = setInterval(cargarPartidaApi, 500);
      // Limpia el intervalo de tiempo antes de desmontar el componente
      return () => clearInterval(intervalo);
    }
  }, [dificultad]);
  const crearTableroApi = async () => {
    try {
      const response = await fetch(`${ip}/partidas/crear/${nombreJugador}/${dimensionesCrear}/${dificultad}`, {
        headers: {
          'Authorization': Cookies.get("auth") as string
        }
      });
      const data = await response.json();
      if (data) {
        await cargarPartidaApi();
        // console.log(data)
      }
    } catch { }

  };

  const manejarClickCasillas: MouseEventHandler<HTMLDivElement> = async (event) => {
    if (estadoBotonMovil == "💣") {
      try {
        let response = await fetch(`${ip}/partidas/accion/destapar/${event.currentTarget.id}/${nombreJugador}`, {
          headers: {
            'Authorization': Cookies.get("auth") as string
          }
        });
        let respuesta = await response.text();
        // console.log(respuesta);

        await cargarPartidaApi(); // Actualizar estados después de destapar la celda
      } catch (error) {
        console.error('Error al destapar la celda:', error);
      }
    } else {
      manejarClickDerechoCasillas(event);
    }
  }

  const manejarClickDerechoCasillas = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch(`${ip}/partidas/accion/bandera/${event.currentTarget.id}/${nombreJugador}`, {
        headers: {
          'Authorization': Cookies.get("auth") as string
        }
      });
      // console.log(response);
      await cargarPartidaApi(); // Actualizar estados después de destapar la celda
    } catch (error) {
      console.error('Error al destapar la celda:', error);
    }
  };
  const manejarClick = async () => {
    if (dimensionesCrear > 4 && dimensionesCrear < 21) {
      await crearTableroApi();
      setMostrarTablero(true);
      setError("");
    } else {
      setError("Dimension no valida, solo se puede ir entre 5 y 20");
    }
  };

  useEffect(() => {
    cargarPartidaApi();
  }, []);




  const crearTableroDimensionesCustom = () => {
    if (estados?.casillas.length === 0) {
      return null;
    }
    //console.log(estados?.dimensiones)
    const dimensiones = parseInt(estados?.dimensiones ?? "");
    const tablero = [];

    let indiceEstado = 0;
    for (let i = 0; i < dimensiones; i++) {
      const fila = [];
      for (let j = 0; j < dimensiones; j++) {
        let estadoCasilla:string|undefined = estados?.casillas[indiceEstado];
        
        let textoCasilla = estadoCasilla == "🦊" ? " " : estadoCasilla;
        if(textoCasilla?.endsWith("🧨")){
         textoCasilla = estadoCasilla ? estadoCasilla[0] + "🧨" : "";
         if(estados?.gameover){
          estadoCasilla= estadoCasilla + " explosiva_gameover";
         }
        }
        fila.push(<div id={`${indiceEstado}`} key={`${i}:${j}`} className={`celda celda_${estadoCasilla}`} onClick={manejarClickCasillas} onContextMenu={manejarClickDerechoCasillas}>{textoCasilla}</div>);
        indiceEstado++;

      }
      tablero.push(<div key={`${i}`} className="fila">{fila}</div>);
    }

    return (
      <div className="tablero">
        {tablero}
      </div>
    );
  };

  useEffect(() => {
    const mostrarTableroCustom = async () => {
      if (mostrarTablero && dimensionesCrear) {
        await Promise.all([crearTableroApi(), cargarPartidaApi()]);
        setMostrarTablero(false);
      }
    };

    mostrarTableroCustom();
  }, [mostrarTablero, dimensionesCrear, estados]);

  if (mostrarTablero) {
    return (
      <div id='contenido'>
        <p>Creando y cargando tablero...</p>
      </div>
    );
  } else {
    return (
      <div id='contenido'>
        {espectador ? (<><h2>Observando a: {nombreJugador} </h2>   {dificultad == "EXTREMO_PLUS" ? (<Afijos ip={ip}/>) : ""}</>) : (<>
          <p>Ingresa las dimensiones para crear un nuevo tablero y elija la dificultad:</p>
          <p>{error}</p>
          {dificultad == "EXTREMO_PLUS" ? (<Afijos ip={ip}/>) : ""}
          <button className="botonMovil" onClick={() => { if (estadoBotonMovil == "🚩") { setEstadoBotonMovil("💣") } else { setEstadoBotonMovil("🚩") } }}>{estadoBotonMovil}</button>
          <input type="number" value={Number.isNaN(dimensionesCrear) ? "" : dimensionesCrear} onChange={(e) => { setDimensionesCrear(parseInt(e.target.value)) }}/>
          <select name="dificultad" id="" onChange={(e) => setDificultad(e.target.value)} value={dificultad} disabled={estados != undefined && !estados.gameover}>
            <option value="FACIL">FACIL</option>
            <option value="NORMAL">NORMAL</option>
            <option value="DIFICIL">DIFICIL</option>
            <option value="EXTREMO">EXTREMO</option>
            <option value="EXTREMO_PLUS">EXTREMO PLUS</option>
          </select>
          <button onClick={manejarClick}>Crear</button>

          <hr />
        
         {estados == null ? "" : (<>  <h2>Tablero actual:</h2>  <p>Banderas Restantes por colocar:{estados?.numBanderasRestantes}</p></>)}
        </>)}
        {poupVictoria ? (<div className='contenedorVictoria'>
          <div className='victoriaContenido'>
            <h1>{nombreJugador}</h1>
            <p>HAS GANADO FELICIDADES</p>
            <button onClick={() => {setPopupVictoria(false); setEstados(undefined)} }>Cerrar</button>
          </div>
        </div>) : ""}
        {crearTableroDimensionesCustom()}
      </div>
    );
  }
};