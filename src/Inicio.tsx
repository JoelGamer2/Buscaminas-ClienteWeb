import { useEffect, useState } from 'react'
import { TableroBuscaminas } from './TableroBuscaminas';
import { RankingInicio } from './RankingInicio';

export const Inicio = ({ip, nombreJugador} : {ip: string, nombreJugador: string | undefined}) => {
  const [jugadores, setJugadores] = useState("");
  const [nombreJugadorAObservar, setnombreJugadorAObservar] = useState("");

    const cargarPartidas = async () => {
        try {
          const response = await fetch(`${ip}/partidas/listar/`);
          const data = await response.json();
          setJugadores(data);
        } catch (error) {
          console.error('Error al obtener la pagina:', error);
        }
      };
      useEffect(() =>{ cargarPartidas();}, []);

  return (
    <div id='contenido'>
{nombreJugadorAObservar == "" ? (<>

<h2 className='tituloInicio'>¡Descubre un nuevo desafio !</h2>
<h3 className='subTituloInicio'>Modo Normal y Modo Extremo Plus: ¡Cambia las reglas del juego!</h3>
<p className='parrafoInicio'>Sumérgete en una emocionante experiencia de Buscaminas con Afijos. En nuestro innovador modo 'Extremo Plus', los afijos añaden una nueva capa de desafío y estrategia. ¡Explora los tableros, evita las minas y desbloquea tu ingenio!</p>

<h3 className='subTituloInicio'>¡Compite en el Ranking y demuestra tus habilidades!</h3>
<div className='rankingInicio'>

</div>
<div className='contenedorRanking'>
<RankingInicio ip={ip}/>
<div className='parrafoRanking'>
<p className='parrafoInicio'>Demuestra tu destreza en el Buscaminas con Afijos compitiendo en nuestro ranking. Supera a otros jugadores y alcanza los primeros puestos en la tabla de clasificación. ¡Muestra tu dominio del juego y conviértete en el buscaminas más destacado!</p>

</div>
</div>

 {(jugadores.length > 0 ) ? (<h2>Puedes Observar a estos jugadores:</h2>) : ""}
{(jugadores.length == 0 ) ?  (<h2>No hay jugadores actualmente para Observar</h2>): ""}
{Array.from(jugadores).map((player: any) => (
<button id='jugadoresEnPartida' key={player.nombre} disabled={player.nombre==nombreJugador} onClick={() => setnombreJugadorAObservar(player.nombre)}>{<>
  <p>{player.nombre}</p>
  <p>{player.dimensiones}x{player.dimensiones}:{player.dificultad}</p>

</>}</button>))}


</>


) : <TableroBuscaminas espectador={true} ip={ip} nombreJugador={nombreJugadorAObservar}></TableroBuscaminas>}



    </div>
  )

}
