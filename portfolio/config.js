let scale = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;

const img = document.getElementById("modalImage");

function showImage(src) {
	scale = 1;
	panX = 0;
	panY = 0;
	img.src = src;
	updateTransform();
}

function updateTransform() {
	img.style.transform = `scale(${scale}) translate(${panX}px, ${panY}px)`;
}

// Scroll to zoom
img.addEventListener("wheel", function (e) {
	e.preventDefault();
	const zoomIntensity = 0.1;
	if (e.deltaY < 0) {
		scale += zoomIntensity;
	} else {
		scale = Math.max(1, scale - zoomIntensity);
		// Reset pan if zoomed out
		if (scale === 1) {
			panX = 0;
			panY = 0;
		}
	}
	updateTransform();
});

// Mouse drag to pan
img.addEventListener("mousedown", function (e) {
	if (scale === 1) return; // Only pan when zoomed
	isPanning = true;
	startX = e.clientX - panX;
	startY = e.clientY - panY;
	img.style.cursor = "grabbing";
});

document.addEventListener("mousemove", function (e) {
	if (!isPanning) return;
	panX = e.clientX - startX;
	panY = e.clientY - startY;
	updateTransform();
});

document.addEventListener("mouseup", function () {
	isPanning = false;
	img.style.cursor = "grab";
});

// Reset pan/zoom when modal closes
document
	.getElementById("imageModal")
	.addEventListener("hidden.bs.modal", function () {
		scale = 1;
		panX = 0;
		panY = 0;
		updateTransform();
	});
// Image gallery modal navigation
const imageElements = Array.from(document.querySelectorAll(".img-thumbnail"));
const imageSources = imageElements.map((img) => img.src);
let currentIndex = 0;

// Show image in modal by index
function showImageByIndex(index) {
	if (index < 0) index = imageSources.length - 1;
	if (index >= imageSources.length) index = 0;
	currentIndex = index;
	document.getElementById("modalImage").src = imageSources[currentIndex];
}

// Attach click handlers to each image to start modal at correct image
imageElements.forEach((img, idx) => {
	img.onclick = function () {
		showImageByIndex(idx);
		const modal = new bootstrap.Modal(document.getElementById("imageModal"));
		modal.show();
	};
});

// Add arrow buttons to modal
document.getElementById("modalPrev").addEventListener("click", function (e) {
	e.stopPropagation();
	showImageByIndex(currentIndex - 1);
});
document.getElementById("modalNext").addEventListener("click", function (e) {
	e.stopPropagation();
	showImageByIndex(currentIndex + 1);
});

// Keyboard arrow navigation
document
	.getElementById("imageModal")
	.addEventListener("shown.bs.modal", function () {
		document.addEventListener("keydown", modalKeyHandler);
	});
document
	.getElementById("imageModal")
	.addEventListener("hidden.bs.modal", function () {
		document.removeEventListener("keydown", modalKeyHandler);
	});

function modalKeyHandler(e) {
	if (e.key === "ArrowLeft") {
		showImageByIndex(currentIndex - 1);
	} else if (e.key === "ArrowRight") {
		showImageByIndex(currentIndex + 1);
	}
}
