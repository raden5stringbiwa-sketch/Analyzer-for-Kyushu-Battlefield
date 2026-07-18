const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

const areas = [

  {
    name: "west",
    canvas: "westCanvas",

    x: 650, 
    y: 380,  

    width: 220,
    height: 380
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

    if(area.width === 0 || area.height === 0){
        continue;
    }

    cropArea(img, area);

    const canvas =
        document.getElementById(area.canvas);

    const owner =
        detectOwner(canvas);

    console.log(
        area.name,
        owner
    );

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

function detectOwner(canvas){

    const ctx = canvas.getContext("2d");

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

    let blue = 0;
    let red = 0;
    let white = 0;
    let green = 0;

    const data = imageData.data;

    for(let i = 0; i < data.length; i += 4){

        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];


        // 緑の平地は除外
        if(g > r * 1.15 && g > b * 1.15){
            green++;
            continue;
        }


        // 青同盟
        if(b > r * 1.2 && b > g * 1.05){
            blue++;
        }


        // 赤同盟
        else if(r > b * 1.2 && r > g * 1.05){
            red++;
        }


        // 白系（未取得候補）
        else if(r > 180 && g > 180 && b > 180){
            white++;
        }

    }


    console.log({
        blue,
        red,
        white,
        green
    });


    if(blue > red && blue > 50){
        return "青";
    }


    if(red > blue && red > 50){
        return "赤";
    }


    return "白";
}

