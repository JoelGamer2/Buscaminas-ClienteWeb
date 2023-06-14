import { useEffect, useState } from "react";

export const Afijos = ({ip} : {ip:string}) => {
    type afijosType = [{ id: number, nombre: string, descripcion: string, icono:string }];

const [afijos, setAfijos] = useState<afijosType>([{"id":-1, "nombre":"", "descripcion":"","icono":""}]);

    const cargarAfijos = async () => {
        try {
          const response = await fetch(`${ip}/partidas/afijos`);
          const data = await response.json();
          setAfijos(data);
        } catch (error) {
          console.error('Error al obtener la pagina:', error);
        }
      };
      useEffect(() => { cargarAfijos(); }, []);


  return (
<>
<div className="Afijos">
    <h3>Afijos:</h3>
{afijos.map((eafijo) => (
<span data-title={eafijo.descripcion}>
  <img id="afijo" src={eafijo.icono} alt={eafijo.nombre} key={eafijo.id+"_"+eafijo.nombre}/>
</span>
))}
<br />
{afijos.map((afijo) => ( <span>{afijo.nombre+" "}</span>))}

</div>
</>   
  )
}
