import { useEffect, useState } from "react"

export const RankingInicio = ({ ip }: { ip: string }) => {

  const [top, setTop] = useState(["error al","Imposible","cargar"]);


  const cargarTop = async () => {
    try {
      const response = await fetch(`${ip}/ranking/top`);
      const data = await response.json();
      setTop(data);
    } catch (error) {
      console.error('Error al obtener la pagina:', error);
    }
  };
  useEffect(() => { cargarTop(); }, []);

  return (
   <>
   
 <div className="topJugadores">
    {top.map((jugador,index) => (<>
    <p id={"top"+(index+1)}>{jugador}</p>
    <br />
    </>))}
     
    
 </div>
   
   </>
  )
}
