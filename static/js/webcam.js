// tooltip setup
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

const videoContainer = document.getElementById("video-container");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const watermark = document.getElementById("watermark");
const captureButton = document.getElementById("capture-btn");
const webcamContainer = document.getElementById("webcam-container");
const spinner = document.getElementById("spinner");
// Added ref for preview & retake feature
const preview = document.getElementById("preview");
const previewContainer = document.getElementById("preview-container");
const retakeButton = document.getElementById("retake-btn");
const uploadButton = document.getElementById("upload-btn");
// Camera Access
const cameraAccessButton = document.getElementById("camera-access-btn");

const setupCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    cameraAccessButton.style.display = "none"; // Hide the button if access is allowed
  } catch (error) {
    console.error("Error Setting Up Camera:", error);
    alert(
      "There was an error setting up the camera. Please check your camera settings and try again."
    );
    cameraAccessButton.style.display = "block"; // Show the button if access is blocked
  }
};
// Only load camera on the webcam page
if (video) {
  setupCamera();
}

captureButton.addEventListener("click", () => {
  canvas.width = videoContainer.offsetWidth;
  canvas.height = videoContainer.offsetHeight;

  const context = canvas.getContext("2d");
  // context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Flip the context horizontally to match the video
  context.scale(-1, 1);
  context.translate(-canvas.width, 0);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Reset the transformation to draw the watermark correctly
  context.setTransform(1, 0, 0, 1, 0, 0);

  // Flip the context horizontally again for the watermark
  context.scale(-1, 1);
  context.translate(-canvas.width, 0);

  // Get the size of the watermark
  const watermarkWidth = 320;
  const watermarkHeight = (watermark.naturalHeight * watermarkWidth) / watermark.naturalWidth;

  // Calculate the position of the watermark
  const watermarkX = (canvas.width - watermarkWidth) / 2;
  const watermarkY = (canvas.height * 0.75 - watermarkHeight / 2) + 20; // 60% down from the top

  context.scale(-1, 1);
  context.translate(-canvas.width, 0);

  context.drawImage(watermark, watermarkX, watermarkY, watermarkWidth, watermarkHeight);

  // Hide the video and capture button, and show the preview and the retake and upload buttons
  webcamContainer.style.display = "none";
  video.style.display = "none";
  captureButton.style.display = "none";
  preview.src = canvas.toDataURL("image/png");
  previewContainer.style.display = "block";
  preview.style.display = "block";
  retakeButton.style.display = "block";
  uploadButton.style.display = "block";
});

// Added event listeners for the retake and upload buttons
retakeButton.addEventListener("click", () => {
  webcamContainer.style.display = "block";
  video.style.display = "block";
  captureButton.style.display = "block";
  previewContainer.style.display = "none";
  preview.style.display = "none";
  retakeButton.style.display = "none";
  uploadButton.style.display = "none";

  // Clear the previous image from the canvas
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
});

uploadButton.addEventListener("click", () => {
  sendImageToServer(canvas.toDataURL("image/png"));
});

const sendImageToServer = (imageData) => {
  spinner.style.display = "inline-block";

  fetch("/selfie/upload_selfie/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `image_data=${encodeURIComponent(imageData)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      spinner.style.display = "none";
      window.location.href = "/success/";
    })
    .catch((error) => {
      alert("Error:", error);
      spinner.style.display = "none";
    });
};


