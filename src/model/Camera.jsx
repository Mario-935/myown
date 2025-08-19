import React, { useRef, useState, useEffect } from 'react';
import p5 from 'p5';
import ml5 from 'ml5';

export default function PoseSketch() {
  const sketchRef = useRef(null);
  const p5Instance = useRef(null);
  const initialized = useRef(false);
  const posesRef = useRef([]);
  const [hasPose, setHasPose] = useState(false);
  const [gpose, setGpose] = useState([]);
  const takePhoto = () => {
    setGpose(posesRef.current[0].keypoints);
    console.log("📸 Foto tomada", gpose[0].keypoints );
  };

  useEffect(() => {
    
    if (initialized.current) return;
    initialized.current = true;

    let video;
    let bodyPose;
    let connections;

    const gotPoses = (results) => {
      posesRef.current = results;
      setHasPose(results.length > 0); // habilita el botón si hay poses
    };
    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(640, 480).parent(sketchRef.current);

        const existingVideos = sketchRef.current.querySelectorAll('video');
        existingVideos.forEach((vid) => {
          if (vid.srcObject) {
            vid.srcObject.getTracks().forEach((track) => track.stop());
          }
          vid.remove();
        });

        video = p.createCapture(p.VIDEO);
        video.size(640, 480);
        video.hide();

        bodyPose = ml5.bodyPose('MoveNet');

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

        for (let i = 0; i < posesRef.current.length; i++) {
          const pose = posesRef.current[i];
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

    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
      initialized.current = false;

      const existingVideos = sketchRef.current?.querySelectorAll('video') || [];
      existingVideos.forEach((vid) => {
        if (vid.srcObject) {
          vid.srcObject.getTracks().forEach((track) => track.stop());
        }
        vid.remove();
      });
    };
  }, []);

  return (
    <div>
      <div ref={sketchRef}></div>
      <button onClick={takePhoto} disabled={!hasPose}>
  Take photo
</button>

    </div>
  );
}
