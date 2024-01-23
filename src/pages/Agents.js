/* eslint-disable */
import React, { useState } from "react";
import aki from "../assets/images/Aki.png";
import jocke from "../assets/images/Jocke.png";
import uki from "../assets/images/Uki.png";
import micko from "../assets/images/Micko.png";
import { useNavigate } from "react-router-dom";

const Agents = () => {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const getResultString = () => {
    switch (selected) {
      case 0:
        return "";
      case 1:
        return `Agent koristi strategiju grananja i ograničavanja. Ukoliko postoje dve ili više parcijalnih putanja istih
        cena, agent bira onu sa više sakuplјenih zlatnika na putanji, a u slučaju dve ili više takvih parcijalnih
        putanja bira onu koja dovodi do zlatnika sa manjom vrednošću identifikacione oznake.`;
      case 2:
        return `Agent koristi brute-force strategiju tako što generiše sve moguće putanje i od svih bira onu sa
        najmanjom cenom.`;
      case 3:
        return `Agent koristi strategiju pohlepne pretrage po dubini tako što prilikom izbora narednog zlatnika za
        sakuplјanje bira onaj do kog je cena puta najmanja. Ukoliko postoje dva ili više takvih zlatnika, kao sledeći
        se bira onaj sa manjom vrednošću identifikacione oznake.`;
      case 4:
        return `Agent koristi A* strategiju pretraživanja, pri čemu se za heurističku funkciju koristi minimalno
        obuhvatno stablo. Ukoliko postoje dve ili više parcijalnih putanja istih vrednosti funkcije procene, agent
        bira onu sa više sakuplјenih zlatnika na putanji, a u slučaju dve ili više takvih parcijalnih putanja bira onu
        koja dovodi do zlatnika sa manjom vrednošću identifikacione oznake.`;
      default:
        return "";
    }
  };
  return (
    <div className="agents-container">
      {/* <h1 className="title">PYTNIK</h1> */}
      <p className="choose">
        Choose your <span>agent</span>
      </p>
      <h3 className="agent-description">{getResultString()}</h3>
      <div className="options-container">
        <div
          className="option option-1"
          onMouseLeave={() => setSelected(0)}
          onMouseOver={() => setSelected(1)}
          onClick={() => navigate("/play/aki")}
        >
          <img alt="agent" width={"70%"} src={aki} />
          <p>Aki</p>
        </div>
        <div
          className="option option-2"
          onMouseLeave={() => setSelected(0)}
          onMouseOver={() => setSelected(2)}
          onClick={() => navigate("/play/jocke")}
        >
          <img alt="agent" width={"70%"} src={jocke} />
          <p>Jocke</p>
        </div>
        <div
          className="option option-3"
          onMouseLeave={() => setSelected(0)}
          onMouseOver={() => setSelected(3)}
          onClick={() => navigate("/play/uki")}
        >
          <img alt="agent" width={"70%"} src={uki} />
          <p>Uki</p>
        </div>
        <div
          className="option option-4"
          onMouseLeave={() => setSelected(0)}
          onMouseOver={() => setSelected(4)}
          onClick={() => navigate("/play/micko")}
        >
          <img alt="agent" width={"70%"} src={micko} />
          <p>Micko</p>
        </div>
      </div>
    </div>
  );
};

export default Agents;
