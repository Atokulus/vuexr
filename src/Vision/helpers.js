import { mat4 } from 'gl-matrix'

export function drawVideoFrameToCanvas(canvas, img) {
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  let x = (canvas.width - img.width * ratio) / 2;
  let y = (canvas.height - img.height * ratio) / 2;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
    x, y, img.width * ratio, img.height * ratio);
}

export function computeProjMat(ratio, cameraMatrix, rmat, tvec, viewMatrix)
{
  const projMat = mat4.create();

  const flipMat = mat4.fromValues(
    1,0,0,0,
    0,-1,0,0,
    0,0,-1,0,
    0,0,0,1
  );

  const homogeneousRotMat = mat4.fromValues(
    rmat[0], rmat[3], rmat[6], 0,
    rmat[1], rmat[4], rmat[7], 0,
    rmat[2], rmat[5], rmat[8], 0,
    0, 0,0, 1
  );

  mat4.mul(projMat, homogeneousRotMat, flipMat);

  const transMat = mat4.fromValues(
    1,0,0, 0,
    0,1,0, 0,
    0,0,1,0,
    tvec[0], tvec[1], tvec[2], 1
  );

  mat4.mul(projMat, transMat, projMat);
  mat4.mul(projMat, viewMatrix, projMat);

  const focalLength = cameraMatrix[0];

  const perspMat = mat4.fromValues(
  1,0,0,0,
   0,1,0,0,
   0,0,1,1/focalLength,
   0,0,0,0
  );

  mat4.mul(projMat, perspMat, projMat);

  const scaleMat = mat4.fromValues(
    ratio, 0, 0, 0,
    0, ratio, 0, 0,
    0, 0, ratio, 0,
    cameraMatrix[2] * ratio, cameraMatrix[5] * ratio, 0, 1
  );

  mat4.mul(projMat, scaleMat, projMat);
  return projMat;
}
