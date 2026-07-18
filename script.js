const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        preview.src = e.target.result;

        preview.style.display = "block";

    };

    reader.readAsDataURL(file);

});
const analyzeButton =
    document.getElementById("analyzeButton");

const result =
    document.getElementById("result");

const cropCanvas =
    document.getElementById("cropCanvas");

const cropCtx =
    cropCanvas.getContext("2d");

analyzeButton.addEventListener("click", async function () {

    if (!preview.src) {

        alert("画像を選択してください");

        return;

    }

    result.textContent =
        "解析中・・・";

// 元画像
const img = preview;

// 切り抜く範囲
const x = 450;
const y = 200;
const width = 350;
const height = 250;

// Canvasサイズ
cropCanvas.width = width;
cropCanvas.height = height;

// 切り抜き
cropCtx.drawImage(
    img,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
);

// OCR
const data =
    await Tesseract.recognize(
        cropCanvas,
        "eng"
    );

    result.textContent =
        data.data.text;

});
