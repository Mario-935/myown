import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import ml5 from 'ml5';

export default function PoseSketch() {
  const sketchRef = useRef();

  useEffect(() => {
    let video;
    let bodyPose;
    let poses = [];
    let connections;
   

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
            console.log("Modelo listo");
          }
        }, 100);
      };
      

      p.draw = () => {
        p.image(video, 0, 0, p.width, p.height);

        for (let i = 0; i < poses.length; i++) {
          let pose = poses[i];
          for (let j = 0; j < (connections || []).length; j++) {
            let pointAIndex = connections[j][0];
            let pointBIndex = connections[j][1];
            let pointA = pose.keypoints[pointAIndex];
            let pointB = pose.keypoints[pointBIndex];
            if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
              p.stroke(255, 0, 0);
              p.strokeWeight(2);
              p.line(pointA.x, pointA.y, pointB.x, pointB.y);
            }
          }
        }

        for (let i = 0; i < poses.length; i++) {
          let pose = poses[i];
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
      function gotPoses(results) {
        poses = results;
      }
      

    const myP5 = new p5(sketch, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
}
