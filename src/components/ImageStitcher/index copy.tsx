import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import './index.css';

function arrayBufferToArray(arrayBuffer: ArrayBuffer, width: number) {
    const array = new Uint8ClampedArray(arrayBuffer);
    console.log(array);
    const res: number[][][] = [];
    let row: number[][] = [];
    for (let i = 0; i < array.length; i += 4) {
        row.push([array[i], array[i + 1], array[i + 2], array[i + 3]]);
        if (i > 0 && (i / 4 + 1) % width === 0) {
            res.push(row);
            row = [];
        }
    }
    return res;
}

const ImageStitcher: FC = (): ReactElement => {
    const inputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [resultURL, setResultURL] = useState<string>('');
    const [imageList, setImageList] = useState<[string, [number, number], ArrayBuffer][]>([]);

    const stitchImages = () => {
        if (imageList.length === 1) return arrayBufferToArray(imageList[1][2], imageList[1][1][0]);
        const stitchedImage = [];
        for (let i = 0; i < imageList.length - 1; ++i) {
            const img1 = imageList[i][2];
            const img1W = imageList[i][1][0];
            const img2 = imageList[i + 1][2];
            const img2W = imageList[i + 1][1][0];
            if (img1W !== img2W) return;
            const imgArray1 = arrayBufferToArray(img1, img1W);
            console.log(imgArray1)
            const imgArray2 = arrayBufferToArray(img2, img2W);
            for (let j = 0; j < imgArray1.length; ++j) {
                if (imgArray1[j].toString() === imgArray2[0].toString()) {
                    break;
                }
                stitchedImage.push(imgArray1[j]);
            }
            if (i === imageList.length - 2) {
                stitchedImage.push(...imgArray2[i]);
            }
        }
        const stitchedImageArrayBuffer = new Uint8Array(stitchedImage.flat(Infinity) as number[]).buffer;
        const imgBlob = new Blob([stitchedImageArrayBuffer]);
        const blobURL = URL.createObjectURL(imgBlob);
        setResultURL(blobURL);
    };

    const selectImage = (e: any) => {
        const imgList: typeof imageList = [];
        for (const item of e.target.files) {
            const reader = new FileReader();
            reader.onloadend = event => {
                const imgArrayBuffer = event.target!.result;
                const imgBlob = new Blob([imgArrayBuffer!]);
                const blobURL = URL.createObjectURL(imgBlob);
                const imgElem = new Image();
                imgElem.src = blobURL;
                imgElem.onload = () => {
                    imgList.push([blobURL, [imgElem.width, imgElem.height], imgArrayBuffer as ArrayBuffer]);
                    if (imgList.length === e.target.files.length) setImageList(imgList);
                };
            };
            reader.readAsArrayBuffer(item);
        }
    };

    return (
        <div className="image-stitcher">
            <input ref={inputRef} type="file" multiple onChange={selectImage} />
            <div className="button-group">
                <button className="select-file-btn" onClick={() => inputRef.current?.click()}>选择图片</button>
                {imageList.length > 0 && <button className="stitch-btn" onClick={stitchImages}>拼接</button>}
            </div>
            <div className="image-list">
                {imageList.map(item => <img key={item[0]} className="source-image" src={item[0]} alt="图片" />)}
            </div>
            {resultURL !== '' && <img ref={imgRef} src={resultURL} alt="拼接后的图片" />}
        </div>
    );
};

export default ImageStitcher;
