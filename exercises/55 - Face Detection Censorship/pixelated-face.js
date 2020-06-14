const video = document.querySelector('.webcam');

const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');

const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext('2d');

const faceDetector = new window.FaceDetector();
console.log(video, canvas, faceCanvas, faceDetector);

const optionsInputs = document.querySelectorAll('.controls input[type="range"');
const options = {
  SIZE: 10,
  SCALE: 1.5,
};

function handleOption(event) {
  const { value, name } = event.currentTarget;
  options[name] = parseFloat(value);
}

optionsInputs.forEach(input =>
  input.addEventListener('input', console.log(event.currentTarget.value))
);

// populate video as an assync function with getUserMedia
async function populateVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 600, height: 400 },
  });
  // set the video src to be the stream
  video.srcObject = stream;
  await video.play();
  // size the canvas to be the same size as the video using video.videoWidth, video.videoHeight

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

async function detect() {
  const faces = await draw.drawDetections(video);
  console.log(faces);
  // ask the browser when next animation frame happens to run something for us
  faces.forEach(drawFace);
  requestAnimationFrame(detect);
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;
  console.log({ width, height, top, left });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, height);
}

const width = face.width * options.SCALE;
const height = face.height * options.SCALE;

function censor({ boundingBox: face }) {
  faceCtx.imageSmoothingEnabled = false;
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
  // draw the small face
  faceCtx.drawImage(
    // 5 source arguments
    video, // where the source comes from
    face.x, // where do we start the source pull from?
    face.y,
    face.width,
    face.height,
    // 4 draw arguments
    face.x, // where should we start drawing x and y ?
    face.y,
    options.SIZE,
    options.SIZE
  );
  // take the face out and draw back to normal size.
  face.ctx.drawImage(
    // IT TAKES THE SAME ARGUMENTS
    faceCanvas, // where the source comes from,
    face.x, // where do we start the source pull from?
    face.y,
    options.SIZE,
    options.SIZE,
    // drawing arguments
    face.x,
    face.y,
    face.width,
    face.height
  );
}
populateVideo().then(detect);
