import React, { useEffect } from 'react';
import ml5 from 'ml5';
import poseImage from '../pose/pose.jpg'; // asegúrate de que esté bien importada

export default function PoseKeypointsOnly() {
  useEffect(() => {
    
    let bodyPose;

    // Crear una imagen y cargarla
    const image = new Image();
    image.src = poseImage;

    image.onload = () => {
      // Crear un canvas fuera del DOM solo para obtener los píxeles
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Inicializar modelo
      bodyPose = ml5.bodyPose('MoveNet', () => {
        // Detectar pose en imagen
        bodyPose.detect(canvas, (results) => {
          if (results && results.length > 0) {
            console.log('Keypoints detectados:', results[0].keypoints);
          } else {
            console.log('No se detectó ninguna pose.');
          }
        });
      });
    };
  }, []);

  return <div>Detectando keypoints en imagen estática...</div>;
}
