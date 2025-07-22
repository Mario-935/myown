import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import ml5 from 'ml5';
import poseImage from '../pose/pose.jpg';

export default function PoseMatcher() {
  const sketchRef = useRef();
  const [matched, setMatched] = useState(false);
  const myP5Ref = useRef(null); // Usamos useRef para guardar la instancia de p5

  useEffect(() => {
    let video;
    let bodyPose;
    let poses = [];
    let referenceKeypoints = [];
    let connections;

    // Cargar imagen y obtener pose de referencia
    const image = new Image();
    image.src = poseImage;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const tempPose = ml5.bodyPose('MoveNet', () => {
        tempPose.detect(canvas, (results) => {
          if (results.length > 0) {
            referenceKeypoints = results[0].keypoints;
            tempPose.model.dispose(); // Liberar recursos
            setupLiveSketch(); // Iniciar cámara y sketch una vez
          }
        });
      });
    };

    // Comparar poses (usuario vs referencia)
    function comparePoses(live, reference, threshold = 80) {
      if (!live || !reference || live.length !== reference.length) return false;

      let totalDistance = 0;
      let validPoints = 0;

      for (let i = 0; i < reference.length; i++) {
        if (live[i].confidence > 0.5 && reference[i].confidence > 0.5) {
          const dx = live[i].x - reference[i].x;
          const dy = live[i].y - reference[i].y;
          totalDistance += Math.sqrt(dx * dx + dy * dy);
          validPoints++;
        }
      }

      if (validPoints === 0) return false;

      const avgDistance = totalDistance / validPoints;
      return avgDistance < threshold;
    }

    // Iniciar el sketch de p5
    const setupLiveSketch = () => {
      // Eliminar instancia anterior si existe
      if (myP5Ref.current) {
        myP5Ref.current.remove();
      }

      const sketch = (p) => {
        p.setup = () => {
          p.createCanvas(640, 480);
          video = p.createCapture(p.VIDEO);
          video.size(640, 480);
          video.hide();

          bodyPose = ml5.bodyPose('MoveNet');
          const waitForModel = setInterval(() => {
            if (bodyPose.model !== null) {
              clearInterval(waitForModel);
              bodyPose.detectStart(video.elt, gotPoses);
              connections = bodyPose.getSkeleton();
            }
          }, 100);
        };

        p.draw = () => {
          p.image(video, 0, 0, p.width, p.height);

          for (let i = 0; i < poses.length; i++) {
            const pose = poses[i];

            // Dibujar líneas entre puntos
            for (let j = 0; j < (connections || []).length; j++) {
              const pointA = pose.keypoints[connections[j][0]];
              const pointB = pose.keypoints[connections[j][1]];
              if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
                p.stroke(255, 0, 0);
                p.line(pointA.x, pointA.y, pointB.x, pointB.y);
              }
            }

            // Dibujar keypoints
            for (const keypoint of pose.keypoints) {
              if (keypoint.confidence > 0.1) {
                p.fill(0, 255, 0);
                p.noStroke();
                p.circle(keypoint.x, keypoint.y, 10);
              }
            }

            // Comparar con referencia
            if (comparePoses(pose.keypoints, referenceKeypoints)) {
              setMatched(true);
            } else {
              setMatched(false);
            }
          }
        };
      };

      myP5Ref.current = new p5(sketch, sketchRef.current); // Guardar instancia en el ref
    };

    function gotPoses(results) {
      poses = results;
    }

    // Limpiar p5 al desmontar componente
    return () => {
      if (myP5Ref.current) {
        myP5Ref.current.remove();
        myP5Ref.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div ref={sketchRef}></div>
      <div style={{ fontSize: '24px', marginTop: '10px', color: matched ? 'green' : 'red' }}>
        {matched ? '✅ ¡Pose imitada correctamente!' : '🔍 Imitando pose...'}
      </div>
    </div>
  );
}
