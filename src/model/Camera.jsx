import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import ml5 from 'ml5';

export default function PoseSketch() {
  const sketchRef = useRef(null);
  const p5Instance = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let video;
    let bodyPose;
    let poses = [];
    let connections;

    const gotPoses = (results) => {
      poses = results;
    };

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(640, 480).parent(sketchRef.current);

        // 🔁 Eliminar videos previos creados por p5
        const existingVideos = sketchRef.current.querySelectorAll('video');
        existingVideos.forEach((vid) => {
          if (vid.srcObject) {
            vid.srcObject.getTracks().forEach((track) => track.stop());
          }
          vid.remove();
        });

        // 🎥 Crear captura y ocultarla
        video = p.createCapture(p.VIDEO);
video.size(640, 480);
video.hide();


        video.size(640, 480);

        // 🧠 Cargar modelo MoveNet
        bodyPose = ml5.bodyPose('MoveNet');

        // ⏳ Esperar a que el modelo esté listo
        const waitForModel = setInterval(() => {
          if (bodyPose.model !== null) {
            clearInterval(waitForModel);
            bodyPose.detectStart(video.elt, gotPoses);
            connections = bodyPose.getSkeleton();
            console.log("✅ Modelo listo");
          }
        }, 100);
      };

      p.draw = () => {
        if (video) {
          p.image(video, 0, 0, p.width, p.height);
        }

        for (let i = 0; i < poses.length; i++) {
          const pose = poses[i];
          for (let j = 0; j < (connections || []).length; j++) {
            const pointA = pose.keypoints[connections[j][0]];
            const pointB = pose.keypoints[connections[j][1]];
            if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
              p.stroke(255, 0, 0);
              p.strokeWeight(2);
              p.line(pointA.x, pointA.y, pointB.x, pointB.y);
            }
          }

          for (const keypoint of pose.keypoints) {
            if (keypoint.confidence > 0.1) {
              p.fill(0, 255, 0);
              p.noStroke();
              p.circle(keypoint.x, keypoint.y, 10);
            }
          }
        }
      };
    };

    // 🎨 Crear nueva instancia p5
    p5Instance.current = new p5(sketch, sketchRef.current);

    // 🔄 Limpieza al desmontar componente
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
      initialized.current = false;

      // 🧹 Limpiar videos dentro del contenedor
      const existingVideos = sketchRef.current?.querySelectorAll('video') || [];
existingVideos.forEach((vid) => {
  if (vid.srcObject) {
    vid.srcObject.getTracks().forEach((track) => track.stop());
  }
  vid.remove();
});

    };
  }, []);

  return <div ref={sketchRef}></div>;
}
