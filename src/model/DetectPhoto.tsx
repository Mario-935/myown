import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { loadPoseModel } from "./Detect_Pose";

type PhotoGameProps = {
  Photo: string;
};

export default function PhotoGame({ Photo }: PhotoGameProps) {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let img: any;
    let bodyPose: any;
    let poses: any[] = [];
    let poseDetected = false;
    let connections: number[][];

    const sketch = (p: any) => {
      p.setup = async () => {
        p.createCanvas(640, 480);
        img = await p.loadImage(Photo);
        img.resize(640, 480);

        bodyPose = await loadPoseModel();
        poses = await bodyPose.detect(img.canvas);
        poseDetected = true;
        connections = bodyPose.getSkeleton();
        console.log("Modelo cargado y poses detectadas.", poses[0].keypoints);
      };

      p.draw = () => {
        p.background(0);
        if (img) p.image(img, 0, 0);

        if (!poseDetected) return;

        for (const pose of poses) {
          // Dibuja líneas (conexiones)
          for (const connection of connections || []) {
            const pointA = pose.keypoints[connection[0]];
            const pointB = pose.keypoints[connection[1]];
            if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
              p.stroke(255, 0, 0);
              p.strokeWeight(2);
              p.line(pointA.x, pointA.y, pointB.x, pointB.y);
            }
          }

          // Dibuja los keypoints
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

    const myP5 = new p5(sketch, sketchRef.current!);

    return () => {
      myP5.remove();
    };
  }, [Photo]);

  return <div ref={sketchRef}></div>;
}
