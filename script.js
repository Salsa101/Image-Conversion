const uploadPage = document.getElementById('uploadPage');
const resultPage = document.getElementById('resultPage');
const imageInput = document.getElementById('imageInput');
const filterSelect = document.getElementById('filterSelect');
const convertButton = document.getElementById('convertButton');
const backButton = document.getElementById('backButton');
const originalCanvas = document.getElementById('originalCanvas');
const convertedCanvas = document.getElementById('convertedCanvas');
const originalCtx = originalCanvas.getContext('2d');
const convertedCtx = convertedCanvas.getContext('2d');

let image = new Image();

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

image.onload = () => {
    originalCanvas.width = convertedCanvas.width = image.width;
    originalCanvas.height = convertedCanvas.height = image.height;
    originalCtx.drawImage(image, 0, 0);
};

convertButton.addEventListener('click', () => {
    if (!image.src) return alert('Please upload an image!');
    const filter = filterSelect.value;
    const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    if (filter === 'grayscale') {
        applyGrayscale(imageData);
    } else if (filter === 'blur') {
        applyBlur(imageData);
    }
    convertedCtx.putImageData(imageData, 0, 0);

    uploadPage.style.display = 'none';
    resultPage.style.display = 'block';
});

backButton.addEventListener('click', () => {
    uploadPage.style.display = 'block';
    resultPage.style.display = 'none';
});

function applyGrayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;      // Red
        data[i + 1] = avg;  // Green
        data[i + 2] = avg;  // Blue
    }
}

function applyBlur(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const copy = new Uint8ClampedArray(data);

    const kernel = [
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
    ];
    const kernelWeight = 25;

    for (let y = 2; y < height - 2; y++) {
        for (let x = 2; x < width - 2; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = -2; ky <= 2; ky++) {
                for (let kx = -2; kx <= 2; kx++) {
                    const px = (y + ky) * width + (x + kx);
                    r += copy[px * 4];
                    g += copy[px * 4 + 1];
                    b += copy[px * 4 + 2];
                }
            }
            const i = (y * width + x) * 4;
            data[i] = r / kernelWeight;
            data[i + 1] = g / kernelWeight;
            data[i + 2] = b / kernelWeight;
        }
    }
}
