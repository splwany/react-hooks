const worker = () => {
    onmessage = function imageDataToMatrix(e) {
        const imgData: ImageData = e.data;
        const { data, width } = imgData;
        const imgArr: number[][][] = [];
        let row: number[][] = [];
        for (let i = 0; i < data.length; i += 4) {
            row.push([data[i], data[i + 1], data[i + 2]]);
            if (i > 0 && (i / 4 + 1) % width === 0) {
                imgArr.push(row);
                row = [];
            }
        }
        postMessage(imgArr);
    }
}

let code = worker.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([code], { type: 'application/javascript' });
const workerScript = URL.createObjectURL(blob);

export default workerScript;