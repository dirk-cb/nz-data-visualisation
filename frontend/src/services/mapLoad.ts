const BASE_PATH = import.meta.env.BASE_URL

const FILENAMES = ["region", "territorial", "sa3", "sa2"]




const fetchCensusData = async (filename: string): Promise<any[]> => {
    
    const url =  `${BASE_PATH}/data/${filename}.json`.replace(/\/+/g, '/');

    let res =  await fetch(url);
    
    return await res.json()

}

export const getMapData = async() => {

    const promises = FILENAMES.map(async (f) => {
        const data = await fetchCensusData(f);
        return [f, data];
    });

    const entries = await Promise.all(promises);

    return Object.fromEntries(entries);
}
