
const images = [
    "Cherry.png",
    "BAR.png",
    "2xBAR.png",
    "3xBAR.png",
    "7.png",
];
const IMG_HEIGHT = 121;
const IMG_WIDTH = 141;

const createImage = (src, ctx, idx) => {
    return new Promise((resolve, reject) => {
        let imageObj = new Image();
        imageObj.src = "/assets/Reel/" + src;
        imageObj.onload = () => {
            ctx.drawImage(imageObj, 0, idx * IMG_HEIGHT, IMG_WIDTH, IMG_HEIGHT);

            resolve();
        }
    })
}

const mergeImages = async (canvas, firstArray) => {
    return new Promise(async (resolve, reject) => {
        if (canvas) {
            let ctx = canvas.getContext('2d');
            for (let i = 0; i < firstArray.length; i++) {
                await createImage(firstArray[i], ctx, i);
            }

        }
        resolve();
    })
}

export const generateImage = async (reel, callback) => {

    let firstArray = images.map(e => e).sort(() => Math.random() - 0.5);
    let canvas = document.getElementById('myCanvas' + reel);

    await mergeImages(canvas, firstArray);
    canvas = document.getElementById('myCanvas' + reel);
    var img = canvas.toDataURL('image/png');


    let combo = firstArray.map((e, i) => {
        return { image: e, posy: IMG_HEIGHT * i };
    });
    return callback(img, reel, combo);

}