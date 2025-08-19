import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import temp from "../Images/pose.jpg";
import picon from "../Images/poseicon.svg";
import ficon from "../Images/fotoicon.svg";

export default function Home() {
  let [gmode, setGmode] = useState<number>(0);
  let [tmode, setTmode] = useState<String>("Pose");
  function handleClick() {
    if (gmode === 0) {
      setGmode(100);
      setTmode("Imagen");
    } else {
      setGmode(0);
      setTmode("Pose");
    }
  }
  return (
    <div className="grid content-center justify-center h-screen gap-10">
      <header>
        <h1 className="font-blank text-7xl grid justify-items-center">TITLE</h1>
      </header>
      <img src={temp} alt="" className="  w-[680px] h-[480]" />
      <div className="grid justify-items-center ">
        <p>Modo de juego:</p>
        <p>{tmode}</p>
        <div className="flex column-3">
          <img src={picon} alt="" className=" h-[30px] pr-2" />
          <button onClick={handleClick}>
            <input type="range" min="0" max="100" value={gmode} />
          </button>
          <img src={ficon} alt="" className=" h-[30px] pl-2" />
        </div>
        <Link to="/Game" state={{ gamemode: gmode }}>
          Start Game
        </Link>
      </div>
    </div>
  );
}
