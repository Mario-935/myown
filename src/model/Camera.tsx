import React, { useRef, useEffect } from "react";
import p5 from "p5";
import ml5 from "ml5";

export default function PoseMatcher() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const myP5Ref = useRef<p5 | null>(null);
  const posesRef = useRef<any[]>([]);
  const connectionsRef = useRef<number[][]>([]);

  useEffect(() => {
    let video: any; // Aquí usé any para evitar el error de tipo
    let bodyPose: any;

    const setupLiveSketch = () => {
      if (myP5Ref.current) {
        myP5Ref.current.remove();
      }

      const sketch = (p: any) => {
        p.setup = () => {
          p.createCanvas(640, 480);
          video = p.createCapture(p.VIDEO);
          video.size(640, 480);
          video.hide();

          bodyPose = ml5.bodyPose("MoveNet");
          const waitForModel = setInterval(() => {
            if (bodyPose.model !== null) {
              clearInterval(waitForModel);
              bodyPose.detectStart(video.elt, gotPoses);
              connectionsRef.current = bodyPose.getSkeleton();
            }
          }, 100);
        };

        p.draw = () => {
          p.image(video, 0, 0, p.width, p.height);

          posesRef.current.forEach((pose) => {
            // Dibujar líneas entre puntos
            for (const [a, b] of connectionsRef.current) {
              const pointA = pose.keypoints[a];
              const pointB = pose.keypoints[b];
              if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
                p.stroke(255, 0, 0);
                p.strokeWeight(2);
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
          });
        };
      };

      myP5Ref.current = new p5(sketch, sketchRef.current!);
    };

    function gotPoses(results: any[]) {
      posesRef.current = results;
    }

    setupLiveSketch();

    return () => {
      if (myP5Ref.current) {
        myP5Ref.current.remove();
        myP5Ref.current = null;
      }
    };
  }, []);

  return <div ref={sketchRef}></div>;
}
