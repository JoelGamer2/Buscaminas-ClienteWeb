import React from 'react';
import ReactDOM from 'react-dom/client'
import './css/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TableroBuscaminas } from './TableroBuscaminas';
import { Header } from './Plantillas/Header';
import { Footer } from './Plantillas/Footer';
import { Inicio } from './Inicio';
import Cookies from 'js-cookie';
import { InicioSesion } from './InicioSesion';
import MiCuenta from './MiCuenta';
import { Ranking } from './Ranking';
const apiIp = "https://api.worldofcataclysm.eu/";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header/>
    <BrowserRouter basename='/'>
      <Routes>    
        <Route path="/" element={<Inicio ip={apiIp} nombreJugador={Cookies.get("jugador")}/>} />
        <Route path="/ranking" element={<Ranking ip={apiIp}/>} />
        <Route path="/buscaminas" element={Cookies.get("jugador") ? <TableroBuscaminas nombreJugador={Cookies.get("jugador") as string } ip={apiIp} espectador={false}/> : <InicioSesion ip={apiIp}/>} />
        <Route path="/micuenta" element={Cookies.get("jugador") ? <MiCuenta ip={apiIp} nombreJugador={Cookies.get("jugador") as string  }/> : <InicioSesion ip={apiIp}/>} />
        <Route path="*" element={<Inicio ip={apiIp} nombreJugador={Cookies.get("jugador")}/>} />
      </Routes>
    </BrowserRouter>
    <Footer/>
  </React.StrictMode>,
);
