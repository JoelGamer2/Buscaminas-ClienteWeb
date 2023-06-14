import { useEffect, useState } from 'react'

export const Ranking = ({ ip }: { ip: string }) => {

  const [temporada, setTemporada] = useState("");
  const [tablero, setTablero] = useState("");
  type rankingType = { partidas: [], temporadas: Array<string>, tableros: Array<string> };
  const [ranking, setRanking] = useState<rankingType>({ "partidas": [], "temporadas": [], "tableros": [] });


  const cargarTablero = async () => {
    try {
      const response = await fetch(`${ip}/ranking/${temporada}/${tablero}`);
      const data = await response.json();
      setRanking(data);
    } catch (error) {
      console.error('Error al obtener la pagina:', error);
    }
  };
  useEffect(() => { cargarTablero(); }, [temporada, tablero]);

  return (
    <div id='contenido'>
      <select name="temporadas" id="temporadas" onChange={(event) => {setTemporada(event.target.value);  setTablero("");}}>
        <option value="">Selecciona una Temporada</option>
        {ranking.temporadas.map((temporada) => (

          <option value={temporada}>{temporada}</option>
        ))}
      </select>
      {temporada != "" ? (
        <select name="tableros" id="tableros" onChange={(event) => setTablero(event.target.value)}>
          <option value="">Selecciona un Tablero</option>
          {ranking.tableros.map((tablero) => (
            <option value={tablero}>{tablero}</option>
          ))}
        </select>
      ) : ""}

      <table border={1}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dificultad</th>
            <th>Tablero</th>
            <th>Tiempo</th>
            <th>Temporada</th>
            <th>Id</th>
          </tr>
        </thead>
        <tbody>
        {ranking.partidas.map((element: any) => (

    <tr>
      <td>{element["nombre"]}</td>
      <td >{element["dificultad"]}</td>
      <td >{element["dimensiones"]}</td>
      <td >{element["score"] + "." + element["milisegundos"]}</td>
      <td>{element["Temporada"]}</td>
      <td>{element["ID"]}</td>
    </tr>
))}
  </tbody>
      </table>
    </div>
  )
}
