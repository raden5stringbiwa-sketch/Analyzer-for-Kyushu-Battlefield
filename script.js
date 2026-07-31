const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

const scoreImageInput =
    document.getElementById("scoreImageInput");

const scorePreview =
    document.getElementById("scorePreview");

let blueScore = 0;
let redScore = 0;
let remainingTime = "";

const measureCanvas =
    document.getElementById("measureCanvas");

const measureInfo =
    document.getElementById("measureInfo");

const measureCtx =
    measureCanvas.getContext("2d");

let startX;
let startY;
let dragging = false;


const areas = [
  {
    name: "西_矢倉",
    type: "矢倉",
    point: 2,
    unlockTime: 0,
    maxPoint: null,
    x:383,
    y:271,
    width:70,
    height:38
  },
    
  {
    name: "西_療養所",
    type: "療養所",
    point: 2,
    unlockTime: 0,
    maxPoint: null,
    x:376,
    y:405,
    width:82,
    height:38
  },

  {
    name: "北_1城",
    type: "城",
    point: 28,
    unlockTime: 2100,
    maxPoint: 25200,
    x:562,
    y:62,
    width:101,
    height:48
  },
  {
    name: "北_2城",
    type: "城",
    point: 28,
    unlockTime: 900,
    maxPoint: 25200,
    x:562,
    y:197,
    width:101,
    height:48
  },

  {
    name: "中央_左望楼",
    type: "望楼",
    point: 10,
    unlockTime: 420,
    maxPoint: null,
    x:485,
    y:338, 
    width:72,
    height:40
  },
  {
    name: "中央_右望楼",
    type: "望楼",
    point: 10,
    unlockTime: 420,
    maxPoint: null,
    x:665,
    y:338,
    width:72,
    height:40
  },
  {
    name: "中央拠点",
    type: "拠点",
    point: 36,
    unlockTime: 1620,
    maxPoint: 65000,
    x:558,
    y:329,
    width:104,
    height:53
  },
  {
    name: "南_3城",
    type: "城",
    point: 28,
    unlockTime: 900,
    maxPoint: 25200,
    x:562,
    y:465,
    width:101,
    height:48
  },
  {
    name: "南_4城",
    type: "城",
    point: 28,
    unlockTime: 2100,
    maxPoint: 25200,
    x:562,
    y:599,
    width:101,
    height:48
  },

  {
    name: "東_矢倉",
    type: "矢倉",
    point: 2,
    unlockTime: 0,
    maxPoint: null,
    x:768,
    y:406,
    width:70,
    height:38
  },
  {
    name: "東_療養所",
    type: "療養所",
    point: 2,
    unlockTime: 0,
    maxPoint: null,
    x:757,
    y:271,
    width:89,
    height:38
  }
];
const cropAreaElement =
    document.getElementById("cropArea");


areas.forEach((area, index) => {

    area.canvas = "canvas_" + index;

cropAreaElement.innerHTML += `
    <div class="facility facility-${index}">
        <h3>${index + 1} ${area.name}</h3>
        <canvas id="${area.canvas}"></canvas>
    </div>
`;

});
imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();
    preview.onload = function(){

    measureCanvas.width =
        preview.naturalWidth;

    measureCanvas.height =
        preview.naturalHeight;

    measureCtx.drawImage(
        preview,
        0,
        0
    );

};

    reader.onload = function (e) {

        preview.src = e.target.result;

        preview.style.display = "block";

    };


    
    reader.readAsDataURL(file);

});
scoreImageInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        scorePreview.src = e.target.result;
        scorePreview.style.display = "block";

    };

    reader.readAsDataURL(file);

});


const analyzeButton =
    document.getElementById("analyzeButton");

const result =
    document.getElementById("result");

const scoreResult =
    document.getElementById("scoreResult");

analyzeButton.addEventListener("click", async function () {

    if (!preview.src) {

        alert("画像を選択してください");

        return;

    }

    result.textContent =
        "解析中・・・";
const elapsedTime =
    parseInt(
        document.getElementById("elapsedTime").value
    ) || 0;
// 元画像
const img = preview;



// OCR（まだ仮）
let output = "解析結果\n";

let bluePerSec = 0;
let redPerSec = 0;

for (const area of areas){

    if(area.width === 0 || area.height === 0){
        output += area.name + " : 座標未設定\n";
        continue;
    }

    cropArea(img, area);

    const canvas =
        document.getElementById(area.canvas);

    const owner =
        detectOwner(canvas, area);

    area.owner = owner;

    const unlocked =
    elapsedTime >= area.unlockTime;

if(unlocked){

    if(owner === "青"){
        bluePerSec += area.point;
    }

    if(owner === "赤"){
        redPerSec += area.point;
    }

}

    output +=
        area.name + " : " + owner + "\n";

}

output += "\n----------------\n";
output += "青 : " + bluePerSec + "点/秒\n";
output += "赤 : " + redPerSec + "点/秒\n";
output += "差 : " + (bluePerSec - redPerSec) + "点/秒\n";

result.textContent = output;



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
// 解析範囲を赤枠表示
/*
    ctx.strokeStyle = "red";
ctx.lineWidth = 2;

let targetHeight;
let startX;
let targetWidth;

if (area.type === "城" || area.type === "拠点") {
    targetHeight = Math.floor(canvas.height / 3);
    startX = Math.floor(canvas.width * 0.2);
    targetWidth = Math.floor(canvas.width * 0.6);
} else {
    targetHeight = Math.floor(canvas.height / 2);
    startX = Math.floor(canvas.width * 0.15);
    targetWidth = Math.floor(canvas.width * 0.7);
}

ctx.strokeRect(
    startX,
    0,
    targetWidth,
    targetHeight
);
*/
}

function detectOwner(canvas, area){

    const ctx = canvas.getContext("2d");

let targetHeight;
let startX;
let targetWidth;

if (area.type === "城" || area.type === "拠点") {
    targetHeight = Math.floor(canvas.height / 3);
    startX = Math.floor(canvas.width * 0.2);
    targetWidth = Math.floor(canvas.width * 0.6);
} else {
    targetHeight = Math.floor(canvas.height / 2);
    startX = Math.floor(canvas.width * 0.15);
    targetWidth = Math.floor(canvas.width * 0.7);
}

const imageData =
    ctx.getImageData(
        startX,
        0,
        targetWidth,
        targetHeight
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
const brightness = r + g + b;

if(
    brightness > 150 &&
    b > r * 1.15 &&
    b > g * 1.05 &&
    b - r > 20
){
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
measureCanvas.addEventListener("mousedown",function(e){

    const rect =
        measureCanvas.getBoundingClientRect();

    startX =
        Math.round((e.clientX-rect.left) *
        measureCanvas.width/rect.width);

    startY =
        Math.round((e.clientY-rect.top) *
        measureCanvas.height/rect.height);

    dragging = true;

});
measureCanvas.addEventListener("mousemove",function(e){

    if(!dragging)return;

    const rect =
        measureCanvas.getBoundingClientRect();

    const nowX =
        Math.round((e.clientX-rect.left) *
        measureCanvas.width/rect.width);

    const nowY =
        Math.round((e.clientY-rect.top) *
        measureCanvas.height/rect.height);

    measureCtx.clearRect(
        0,
        0,
        measureCanvas.width,
        measureCanvas.height
    );

    measureCtx.drawImage(
        preview,
        0,
        0
    );

    measureCtx.strokeStyle="red";

    measureCtx.lineWidth=3;

    measureCtx.strokeRect(
        startX,
        startY,
        nowX-startX,
        nowY-startY
    );

});

measureCanvas.addEventListener("mouseup",function(e){

    dragging=false;

    const rect =
        measureCanvas.getBoundingClientRect();

    const endX =
        Math.round((e.clientX-rect.left) *
        measureCanvas.width/rect.width);

    const endY =
        Math.round((e.clientY-rect.top) *
        measureCanvas.height/rect.height);

    const x =
        Math.min(startX,endX);

    const y =
        Math.min(startY,endY);

    const width =
        Math.abs(endX-startX);

    const height =
        Math.abs(endY-startY);

    measureInfo.textContent=
`x:${x}
y:${y}
width:${width}
height:${height}`;
});
