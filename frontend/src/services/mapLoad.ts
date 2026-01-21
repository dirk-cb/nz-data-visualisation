import { asyncBufferFromUrl, parquetReadObjects } from 'hyparquet';


const BASE_PATH = import.meta.env.BASE_URL

const FILENAMES = ["region", "territorial", "sa3", "sa2"]

const fetchCensusData = async (filename: string): Promise<any[]> => {
    
    const url = `${BASE_PATH}/data/${filename}.parquet`.replace(/\/+/g, '/');
    
    const file = await asyncBufferFromUrl({ url });
    return await parquetReadObjects({ file });
}

export const getMapData = async() => {

    const promises = FILENAMES.map(async (f) => {
        const data = await fetchCensusData(f);
        return [f, data];
    });

    const entries = await Promise.all(promises);

    return Object.fromEntries(entries);
}
