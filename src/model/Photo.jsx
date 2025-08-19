
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import ml5 from 'ml5';
import photo from '../Images/pose.jpg'; // Asegúrate de que esta ruta sea correcta y que la imagen exista en tu proyecto
 // asegúrate de que la ruta sea válida

export default function PoseSketch() {
  const sketchRef = useRef();

  useEffect(() => {
    // 🔴 Eliminar cualquier <video> sobrante de sketches anteriores
    const videos = document.querySelectorAll('video');
    videos.forEach((vid) => {
      if (vid.srcObject) {
        vid.srcObject.getTracks().forEach((track) => track.stop());
      }
      vid.remove();
    });
  
    let img;
    let bodyPose;
    let poses = [];
    let connections;
    let poseDetected = false;
  
    const sketch = (p) => {
      p.setup = async () => {
        p.createCanvas(640, 480);
  
        p.loadImage(photo, (loadedImg) => {
          img = loadedImg;
          img.resize(640, 480);
  
          bodyPose = ml5.bodyPose('MoveNet', () => {
            bodyPose.detect(img.canvas, (results) => {
              poses = results;
              poseDetected = true;
              connections = bodyPose.getSkeleton();
              console.log("Modelo cargado y poses detectadas.", poses[0].keypoints);
            });
          });
        });
      };
  
      p.draw = () => {
        p.background(0);
  
        if (img) {
          p.image(img, 0, 0, p.width, p.height);
        }
  
        if (!poseDetected) return;
  
        for (let i = 0; i < poses.length; i++) {
          let pose = poses[i];
          for (let j = 0; j < (connections || []).length; j++) {
            let pointA = pose.keypoints[connections[j][0]];
            let pointB = pose.keypoints[connections[j][1]];
            if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
              p.stroke(255, 0, 0);
              p.strokeWeight(2);
              p.line(pointA.x, pointA.y, pointB.x, pointB.y);
            }
          }
  
          for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.confidence > 0.1) {
              p.fill(0, 255, 0);
              p.noStroke();
              p.circle(keypoint.x, keypoint.y, 10);
            }
          }
        }
      };
    };
  
    const myP5 = new p5(sketch, sketchRef.current);
  
    return () => {
      myP5.remove();
  
      // 🔄 También asegurarse de limpiar videos al desmontar
      const remainingVideos = document.querySelectorAll('video');
      remainingVideos.forEach((vid) => {
        if (vid.srcObject) {
          vid.srcObject.getTracks().forEach((track) => track.stop());
        }
        vid.remove();
      });
    };
  }, []);
  

  return <div ref={sketchRef}></div>;
}
