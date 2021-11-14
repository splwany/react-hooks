import { FC, ReactElement, useEffect, useRef, useState } from 'react';
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

function getImageDatas(imgDataUrlList: string[]) {
    const promiseList = imgDataUrlList.map(imgDataUrl => {
        return new Promise<ImageData>((resolve, reject) => {
            const img = new Image();
            img.src = imgDataUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.setAttribute('width', img.width.toString());
                canvas.setAttribute('height', img.height.toString());
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
                if (imgData) resolve(imgData);
                else reject('图片读取失败');
            };
        });
    });
    return Promise.all(promiseList);
}

function cropImageData(imgData: ImageData, top: number, bottom: number) {
    const { data, width, height } = imgData;
    const start = 4 * width * Math.floor(height * top);
    const end = 4 * width * Math.floor(height * (1 - bottom));
    const cropData = data.subarray(start, end);
    return new ImageData(cropData, width);
}

function concatImgDatas(imgDataList: ImageData[]) {
    if (imgDataList.length === 0) return '';
    const width = imgDataList[0].width.toString();
    const heightList = [0, ...imgDataList.map(imgData => imgData.height)];
    const height = heightList.reduce((sum, cur) => sum + cur).toString();
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    const ctx = canvas.getContext('2d');
    imgDataList.forEach((imgData, i) => {
        ctx?.putImageData(imgData, 0, heightList[i]);
    });
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
            await getImageDataUrl(file).then((blobUrl: string) => {
                list.push(blobUrl);
            }, err => console.log(err));
        }
        setResultURL('');
        setImgDataUrlList(list);
        setCropRangeList(new Array(list.length).fill([0, 0]));
    };

    const stitchImages = async () => {
        const imgDataList: ImageData[] = await getImageDatas(imgDataUrlList);

        const cropedImgDataList = imgDataList.map((imgData, i) => cropImageData(imgData, ...cropRangeList[i]));
        const stitchedImgDataUrl = concatImgDatas(cropedImgDataList);
        
        setResultURL(stitchedImgDataUrl);
    };

    const onSelectorChange = (index: number, top: number, bottom: number) => {
        cropRangeList[index] = [top, bottom];
        setCropRangeList([...cropRangeList]);
    };

    const onReset = () => {
        setResultURL('');
    };

    return (
        <div className="image-stitcher">
            <input ref={inputRef} type="file" multiple onChange={selectImage} />
            <div className="button-group">
                <button className="select-file-btn" onClick={() => inputRef.current?.click()}>选择图片</button>
                {imgDataUrlList.length > 0 && (
                    <div className="stitch-btn-group">
                        <button className="reset-btn" onClick={onReset}>重置</button>
                        <button className="stitch-btn" onClick={stitchImages}>拼接</button>
                    </div>
                )}
            </div>
            {resultURL === '' && (
                <div className="image-list" ref={imageListRef}>
                    {imgDataUrlList.map((item, i) => <AreaSelector key={`selector-${i}`} src={item} onChange={(top, bottom) => onSelectorChange(i, top, bottom)} />)}
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
    onChange: (top: number, bottom: number) => void;
}

const throttle = (fn: CallableFunction) => {
    let lock = false;
    const unLock = () => lock = false;
    return (...args: any[]) => {
        if (lock) return;
        lock = true;
        fn(...args);
        requestAnimationFrame(unLock);
    };
};

const AreaSelector: FC<IAreaSelectorProps> = ({
    src,
    onChange
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

    const onTopBarMouseDown = (e: any) => {
        setTopTouched(true);
        setTopStartY(e.pageY);
    };

    const onBottomBarMouseDown = (e: any) => {
        setBottomTouched(true);
        setBottomStartY(e.pageY);
    };

    const onMouseMove = throttle((e: any) => {
        if (topTouched) {
            const distance = e.pageY - topStartY;
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
            const distance = bottomStartY - e.pageY;
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
            
            if (topTouched || bottomTouched) onChange(Number(top) / height!, Number(bottom) / height!);
            setTopTouched(false);
            setBottomTouched(false);
        };
        const body = document.querySelector('body');
        body!.addEventListener('mouseup', mouseUpListener);
        return () => {
            body!.removeEventListener('mouseup', mouseUpListener);
        };
    }, [height, onChange, topTouched, bottomTouched]);

    return (
        <div className="area-selector" onMouseMove={onMouseMove}>
            <img className="source-image" src={src} alt="图片" />
            <div className="area-box" ref={areaRef}>
                <div className="bar top-bar" ref={topRef} onMouseDown={onTopBarMouseDown}></div>
                <div className="bar bottom-bar" ref={bottomRef} onMouseDown={onBottomBarMouseDown}></div>
            </div>
        </div>
    );
};

export default ImageStitcher;
