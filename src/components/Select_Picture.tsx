import React from "react";
import PoseSketch from "../model/Camera";
import Pose1 from "../Images/pose1.jpg";
import Pose2 from "../Images/pose2.jpg";
import Pose3 from "../Images/pose3.jpg";
import Pose4 from "../Images/pose4.jpg";
import Pose5 from "../Images/pose5.jpg";
import Pose6 from "../Images/pose6.jpg";

const SelectPicture = ({
  gamemode,
  onSelect,
}: {
  gamemode: number;
  onSelect: (pic: string) => void;
}) => {
  if (gamemode === 100) {
    return (
      <div className="grid content-center justify-center justify-items-center h-screen w-screen">
        <h1>Select Image</h1>
        <div className="grid grid-cols-3 grid-rows-2 gap-4 h-fit max-w-3xl">
          {[Pose1, Pose2, Pose3, Pose4, Pose5, Pose6].map((pose, index) => (
            <img
              key={index}
              className="h-fit cursor-pointer border-2 hover:border-blue-500"
              src={pose}
              alt={`pose-${index}`}
              onClick={() => onSelect(pose)}
            />
          ))}
        </div>
        <div className=" grid grid-cols-2 h-auto w-auto">
          <p>I have other pic :P </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const fileURL = URL.createObjectURL(e.target.files[0]);
                onSelect(fileURL);
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (gamemode === 0) {
    return (
      <div className="grid content-center justify-center justify-items-center h-screen w-screen">
        <h1>Let's take a picture</h1>
        <p>Do your best pose :D</p>
        <PoseSketch />
      </div>
    );
  }

  return null;
};

export default SelectPicture;
