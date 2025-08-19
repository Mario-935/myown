import React, { useState } from "react";
import SelectPicture from "../components/Select_Picture";
import PlayGame from "../components/Play_Game";
import { useLocation } from "react-router-dom";

const Game = () => {
  const location = useLocation();
  const gamemode = (location.state as { gamemode: number })?.gamemode ?? 0;

  const [ready, setReady] = useState<boolean>(false);
  const [selectedPic, setSelectedPic] = useState<string | null>(null);

  function onClick() {
    setReady(true);
  }

  if (!ready) {
    return (
      <>
        <SelectPicture gamemode={gamemode} onSelect={setSelectedPic} />
        <button onClick={onClick} disabled={!selectedPic}>
          Ready
        </button>
      </>
    );
  }

  return (
    <div>
      <PlayGame gamemode={gamemode} pic={selectedPic ?? ""} />
    </div>
  );
};

export default Game;
