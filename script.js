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

analyzeButton.addEventListener("click", async function () {

    if (!preview.src) {

        alert("画像を選択してください");

        return;

    }

    result.textContent =
        "解析中・・・";

    const data =
        await Tesseract.recognize(

            preview.src,

            "eng"

        );

    result.textContent =
        data.data.text;

});
