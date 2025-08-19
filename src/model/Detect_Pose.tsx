// poseModel.ts
import ml5 from "ml5";

let bodyPose: any = null;

export const loadPoseModel = (): Promise<any> => {
  return new Promise((resolve) => {
    if (bodyPose) return resolve(bodyPose);

    bodyPose = ml5.bodyPose("MoveNet", () => {
      console.log("✅ Modelo de pose cargado");
      resolve(bodyPose);
    });
  });
};
