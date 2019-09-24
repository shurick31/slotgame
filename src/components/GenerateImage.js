import React from 'react';

const IMG_HEIGHT = 121;
const IMG_WIDTH = 141;



export default class GenerateImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reelIdx: props.reel,
            images: [
                "Cherry.png",
                "BAR.png",
                "2xBAR.png",
                "3xBAR.png",
                "7.png",
            ],
            canvas: null
        }
        this.refs = props.refs;

    }

    createImage = (src, ctx, idx) => {
        return new Promise((resolve, reject) => {
            let imageObj = new Image();
            imageObj.src = "/assets/Reel/" + src;
            imageObj.onload = () => {
                ctx.drawImage(imageObj, 0, idx * IMG_HEIGHT, IMG_WIDTH, IMG_HEIGHT);

                resolve();
            }
        })
    }

    mergeImages = async (canvas, firstArray) => {
        return new Promise(async (resolve, reject) => {
            if (canvas) {
                let ctx = canvas.getContext('2d');
                for (let i = 0; i < firstArray.length; i++) {
                    await this.createImage(firstArray[i], ctx, i);
                }

            }
            resolve();
        })


    }


    async componentDidMount() {
        const { images } = this.state;
        let firstArray = images.map(e => e).sort(() => Math.random() - 0.5);
        let canvas = document.getElementById('myCanvas' + this.state.reelIdx);

        await this.mergeImages(canvas, firstArray);
        canvas = document.getElementById('myCanvas' + this.state.reelIdx);
        var img = canvas.toDataURL('image/png');

        this.setState({ firstArray, image: img }, () => {
            let combo = firstArray.map((e, i) => {
                return { image: e, posy: IMG_HEIGHT * i };
            });
            this.props.getImage(img, this.props.reel, combo);
        });
    }


    render() {
        return (
            null
        );

    }

}