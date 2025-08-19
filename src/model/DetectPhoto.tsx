import React, { useEffect } from "react";
import ml5 from "ml5";

const PoseKeypointsOnly = ({ Photo }: { Photo: string }) => {
  useEffect(() => {
    let bodyPose:
      | {
          detect: (
            input: HTMLImageElement | HTMLCanvasElement,
            callback: (results: any) => void
          ) => void;
        }
      | undefined;

    // Crear una imagen HTML y cargarla
    const image = new Image();
    image.src = Photo;

    image.onload = () => {
      // Crear un canvas fuera del DOM solo para obtener los píxeles
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Inicializar modelo
        bodyPose = ml5.bodyPose("MoveNet", () => {
          // Aquí pasamos el CANVAS (o la imagen)
          bodyPose?.detect(canvas, (results: any) => {
            if (results && results.length > 0) {
              console.log("Keypoints detectados:", results[0].keypoints);
            } else {
              console.log("No se detectó ninguna pose.");
            }
          });
        });
      } else {
        console.error("No se pudo obtener el contexto del canvas.");
      }
    };
  }, [Photo]);

  return (
    <div>
      Detectando keypoints en imagen estática...
      <img src={Photo} alt="Pose" />
    </div>
  );
};

export default PoseKeypointsOnly;
