import { asyncBufferFromUrl, parquetMetadataAsync, parquetReadObjects } from 'hyparquet';


const BASE_PATH = import.meta.env.BASE_URL

const FILENAMES = ["region", "territorial", "sa3", "sa2"]

async function loadParquet(url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const file = {
        byteLength: arrayBuffer.byteLength,
        slice: (start: any, end: any) => arrayBuffer.slice(start, end)
    };
 
    // 5. Now read the objects from the local "file" object
    return file // await parquetReadObjects({ file });
}

const fetchCensusData = async (filename: string): Promise<any[]> => {
    
    const url = `${BASE_PATH}/data/${filename}.parquet`.replace(/\/+/g, '/');

    const response_head = await fetch(url, { method: 'HEAD' });
    const bytelen = (response_head.headers.get('content-length') as any)
    const file = await asyncBufferFromUrl({url:url, byteLength:bytelen});
    const read = await parquetReadObjects({ file });
    
    return read

}

export const getMapData = async() => {

    const promises = FILENAMES.map(async (f) => {
        const data = await fetchCensusData(f);
        return [f, data];
    });

    const entries = await Promise.all(promises);

    return Object.fromEntries(entries);
}
