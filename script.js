const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

const areas = [

    {
        name: "west",
        canvas: "westCanvas",
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },

    {
        name: "north",
        canvas: "northCanvas",
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },

    {
        name: "center",
        canvas: "centerCanvas",
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },

    {
        name: "south",
        canvas: "southCanvas",
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },

    {
        name: "east",
        canvas: "eastCanvas",
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }

];

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

// 元画像
const img = preview;

// 5分割表示
for (const area of areas){

    cropArea(img, area);

}

// OCR（まだ仮）
result.textContent =
    "5エリア切り抜き完了";



});
function cropArea(image, area){

    const canvas =
        document.getElementById(area.canvas);

    const ctx =
        canvas.getContext("2d");

    canvas.width =
        area.width;

    canvas.height =
        area.height;

    ctx.drawImage(

        image,

        area.x,
        area.y,
        area.width,
        area.height,

        0,
        0,
        area.width,
        area.height

    );

}
