const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvase')[0];
const canvasCtx = canvasElement.getContext('2d');

function setup() {
	createCanvas(640, 480);

	const camera = new Camera(videoElement, {
		onFrame: async () => {
			await hands.send({image: videoElement});
		},
		width: 640,
		height: 480
	});
	camera.start();

	const hands = new Hands({locateFile: (file) => {
		return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
	}});
	hands.setOptions({
		maxNumHands: 2,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.5
	});
	hands.onResults(onResults);
}

function draw() {
	background(220);
}

function onResults(results){
	canvasCtx.save();
	canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

	if(results.multiHandLandmarks) {
		for(const landmarks of results.multiHandLandmarks) {
			drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
			drawLandMarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
		}
	}
	canvasCtx.restore();
}
