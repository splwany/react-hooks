import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { getDate, throttle } from '../../utils/common';
import './index.css';

function getImageDataUrl(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = event => {
            const imgDataUrl = event.target!.result as string;
            resolve(imgDataUrl);
        };
        reader.onerror = err => reject(err);
        reader.readAsDataURL(blob);
    });
}

function getImageElements(imgDataUrlList: string[]) {
    const promiseList = imgDataUrlList.map(imgDataUrl => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = imgDataUrl;
            img.onload = () => {
                resolve(img);
            };
        });
    });
    return Promise.all(promiseList);
}

function imgElement2ImageData(imgElement: HTMLImageElement, width: number, height: number) {
    let {width: w, height: h} = imgElement;
    const ratioW = width / w;
    const ratioH = height / h;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());
    const ctx = canvas.getContext('2d');
    ctx?.scale(ratioW, ratioH);
    ctx?.drawImage(imgElement, 0, 0);
    return ctx?.getImageData(0, 0, canvas.width, canvas.height)!;
}

function cropImageData(imageData: ImageData, top: number, bottom: number) {
    const { data, width, height } = imageData;
    const start = 4 * width * Math.floor(height * top);
    const end = 4 * width * Math.floor(height * (1 - bottom));
    return new ImageData(data.subarray(start, end), width);
}

function cropAndConcatImgDatas(imgElementList: HTMLImageElement[], cropRangeList: [number, number][], maxWidth: number = 1080) {
    if (imgElementList.length === 0) return '';

    const width = maxWidth;
    const heightList = [];
    let height = 0;
    const imgDataList: ImageData[] = [];
    for (let i = 0; i < imgElementList.length; ++i) {
        let {width: w, height: h} = imgElementList[i];
        const ratio = width / w;
        h *= ratio;

        const imgData = imgElement2ImageData(imgElementList[i], width, h);
        const cropedImgData = cropImageData(imgData, ...cropRangeList[i]);

        height += cropedImgData.height;
        imgDataList.push(cropedImgData);
        heightList.push(cropedImgData.height);
    }

    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());
    const ctx = canvas.getContext('2d');
    let lastY = 0;
    for(let i = 0; i < imgDataList.length; ++i) {
        ctx?.putImageData(imgDataList[i], 0, lastY);
        lastY += heightList[i];
    }

    return canvas.toDataURL();
}

const ImageStitcher: FC = (): ReactElement => {
    const inputRef = useRef<HTMLInputElement>(null);
    const imageListRef = useRef<HTMLDivElement>(null);
    const [imgDataUrlList, setImgDataUrlList] = useState<string[]>([]);
    const [cropRangeList, setCropRangeList] = useState<[number, number][]>([]);
    const resultImageRef = useRef<HTMLImageElement>(null);
    const [resultURL, setResultURL] = useState<string>('');

    const selectImage = async (e: any) => {
        const fileList = e.target.files;
        const list: string[] = [];
        for (let i = 0; i < fileList.length; ++i) {
            const file = fileList[i];
            const blobUrl = await getImageDataUrl(file);
            list.push(blobUrl);
        }
        setResultURL('');
        setImgDataUrlList(list);
        setCropRangeList(new Array(list.length).fill([0, 0]));
    };

    const stitchImages = async () => {
        const imgElementList: HTMLImageElement[] = await getImageElements(imgDataUrlList);
        const stitchedImgDataUrl = cropAndConcatImgDatas(imgElementList, cropRangeList, 1080);
        setResultURL(stitchedImgDataUrl);
    };

    const saveImage = async () => {
        const a = document.createElement('a');
        const event = new MouseEvent('click');
        a.download = `长图_${getDate()}`;
        a.href = resultURL;
        a.dispatchEvent(event);
    }

    const onSelectorChange = (index: number, top: number, bottom: number) => {
        cropRangeList[index] = [top, bottom];
        setCropRangeList([...cropRangeList]);
    };

    const onDeleteImg = (index: number) => {
        imgDataUrlList.splice(index, 1);
        setImgDataUrlList([...imgDataUrlList]);
        cropRangeList.splice(index, 1);
        setCropRangeList([...cropRangeList]);
    }

    const onOrderChange = (index: number, orderDelta: number) => {
        const maxLen = imgDataUrlList.length;
        const targetIndex = (index + orderDelta + maxLen) % maxLen;
        [imgDataUrlList[index], imgDataUrlList[targetIndex]] = [imgDataUrlList[targetIndex], imgDataUrlList[index]];
        setImgDataUrlList([...imgDataUrlList]);
    }

    const onAddImgClicked = (index: number) => {
        const inputElem = document.createElement('input');
        inputElem.setAttribute('type', 'file');
        inputElem.setAttribute('accept', 'image/*');
        inputElem.setAttribute('multiple', 'true');
        inputElem.addEventListener('change', async (e: any) => {
            const fileList = e.target.files;
            const list: string[] = [];
            for (let i = 0; i < fileList.length; ++i) {
                const file = fileList[i];
                const blobUrl = await getImageDataUrl(file);
                list.push(blobUrl);
            }
            imgDataUrlList.splice(index + 1, 0, ...list);
            setImgDataUrlList([...imgDataUrlList]);
            cropRangeList.splice(index + 1, 0, [0, 0]);
            setCropRangeList([...cropRangeList]);
        });
        inputElem.click();
    }

    const onReset = () => {
        setResultURL('');
    };

    return (
        <div className="image-stitcher">
            <input ref={inputRef} type="file" accept="image/*" multiple onChange={selectImage} />
            <div className="button-group">
                <button className="select-file-btn" onClick={() => inputRef.current?.click()}>选择图片</button>
                {imgDataUrlList.length > 0 && (
                    <div className="stitch-btn-group">
                        <button className="reset-btn" onClick={onReset}>重置</button>
                        <button className="stitch-btn" onClick={stitchImages}>拼接</button>
                        {resultURL !== '' && (
                            <button className="save-btn" onClick={saveImage}>保存</button>
                        )}
                    </div>
                )}
            </div>
            {resultURL === '' && (
                <div className="image-list" ref={imageListRef}>
                    {imgDataUrlList.map((item, i) => (
                        <div className="selector-item" key={`selector-item-${i}`}>
                            <AreaSelector src={item}
                                onSelectorChange={(top, bottom) => onSelectorChange(i, top, bottom)}
                                onDeleteImg={() => onDeleteImg(i)}
                                onOrderChange={(orderDelta) => onOrderChange(i, orderDelta)} />
                            <button className="add-img-btn" onClick={() => onAddImgClicked(i)}></button>
                        </div>
                    ))}
                </div>
            )}
            {resultURL !== '' && (
                <div className="result">
                    <img className="result-image" ref={resultImageRef} src={resultURL} alt="拼接后的图片" />
                </div>
            )}
        </div>
    );
};

interface IAreaSelectorProps {
    src: string;
    onSelectorChange: (top: number, bottom: number) => void;
    onOrderChange: (orderDelta: number) => void;
    onDeleteImg: () => void;
}

const AreaSelector: FC<IAreaSelectorProps> = ({
    src,
    onSelectorChange,
    onOrderChange,
    onDeleteImg
}) => {

    const [topTouched, setTopTouched] = useState<boolean>(false);
    const [topStartY, setTopStartY] = useState<number>(0);
    const [topStartOffset, setTopStartOffset] = useState<number>(0);

    const [bottomTouched, setBottomTouched] = useState<boolean>(false);
    const [bottomStartY, setBottomStartY] = useState<number>(0)
    const [bottomStartOffset, setBottomStartOffset] = useState<number>(0);

    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const areaRef = useRef<HTMLDivElement>(null);
    const height = areaRef.current?.clientHeight;

    const onTopBarStart = (e: any) => {
        setTopTouched(true);
        setTopStartY(e.type === 'mousedown' ? e.pageY : e.targetTouches[0].pageY);
    };

    const onBottomBarStart = (e: any) => {
        setBottomTouched(true);
        setBottomStartY(e.type === 'mousedown' ? e.pageY : e.targetTouches[0].pageY);
    };

    const onMove = throttle((e: any) => {
        const pageY = e.type === 'mousemove' ? e.pageY : e.targetTouches[0].pageY;
        if (topTouched) {
            const distance = pageY - topStartY;
            let newTop = topStartOffset + distance;
            if (newTop < 0) newTop = 0;
            else if (newTop > height! - bottomStartOffset) newTop = height! - bottomStartOffset;
            topRef.current!.style.top = `${newTop}px`;
            const topPercent = newTop / height!;
            const bottomPercent = 1 - bottomStartOffset / height!;
            areaRef.current!.style.background = `
                linear-gradient(to bottom,
                rgba(0,0,0,0.7) ${topPercent*100}%,
                rgba(0,0,0,0) ${topPercent*100}%,
                rgba(0,0,0,0) ${bottomPercent*100}%,
                rgba(0,0,0,0.7) ${bottomPercent*100}%)`;
        } else if (bottomTouched) {
            const distance = bottomStartY - pageY;
            let newBottom = bottomStartOffset + distance;
            if (newBottom < 0) newBottom = 0;
            else if (newBottom > height! - topStartOffset) newBottom = height! - topStartOffset;
            bottomRef.current!.style.bottom = `${newBottom}px`;
            const topPercent = topStartOffset / height!;
            const bottomPercent = 1 - newBottom / height!;
            areaRef.current!.style.background = `
                linear-gradient(to bottom,
                rgba(0,0,0,0.7) ${topPercent*100}%,
                rgba(0,0,0,0) ${topPercent*100}%,
                rgba(0,0,0,0) ${bottomPercent*100}%,
                rgba(0,0,0,0.7) ${bottomPercent*100}%)`;
        }
    });

    useEffect(() => {
        const mouseUpListener = () => {
            let top = topRef.current!.style.top;
            top = top.substring(0, top.length - 2);
            setTopStartOffset(Number(top));

            let bottom = bottomRef.current!.style.bottom;
            bottom = bottom.substring(0, bottom.length - 2);
            setBottomStartOffset(Number(bottom));
            
            if (topTouched || bottomTouched) onSelectorChange(Number(top) / height!, Number(bottom) / height!);
            setTopTouched(false);
            setBottomTouched(false);
        };
        const body = document.querySelector('body');
        body!.addEventListener('mouseup', mouseUpListener);
        body!.addEventListener('touchend', mouseUpListener);
        return () => {
            body!.removeEventListener('mouseup', mouseUpListener);
            body!.removeEventListener('touchend', mouseUpListener);
        };
    }, [height, onSelectorChange, topTouched, bottomTouched]);

    return (
        <div className="area-selector" onMouseMove={onMove} onTouchMove={onMove}>
            <div className="area-item">
                <img className="source-image" src={src} alt="图片" />
                <div className="area-box" ref={areaRef}>
                    <div className="bar top-bar" ref={topRef} onMouseDown={onTopBarStart} onTouchStart={onTopBarStart}></div>
                    <div className="bar bottom-bar" ref={bottomRef} onMouseDown={onBottomBarStart} onTouchStart={onBottomBarStart}></div>
                </div>
            </div>
            <div className="order-btn-group">
                <button className="order-btn up-btn" onClick={() => onOrderChange(-1)}></button>
                <button className="order-btn delete-btn" onClick={() => onDeleteImg()}></button>
                <button className="order-btn down-btn" onClick={() => onOrderChange(1)}></button>
            </div>
        </div>
    );
};

export default ImageStitcher;
