import { parquetRead } from 'hyparquet';

const BASE_PATH = import.meta.env.BASE_URL

const FILENAMES = ["region", "territorial", "sa3", "sa2"]



async function loadMapData(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  let decodedData: any[] = [];

  await parquetRead({
    file: buffer,
    onComplete: (rows) => {
      decodedData = rows;
    },
  });

  return decodedData;
}


const fetchCensusData = async (filename: string): Promise<any[]> => {
    
    const url = "https://dirk-cb.github.io/"  + `${BASE_PATH}/data/${filename}.parquet`.replace(/\/+/g, '/');

    let res = await loadMapData(url)
    
    return res

}

export const getMapData = async() => {

    const promises = FILENAMES.map(async (f) => {
        const data = await fetchCensusData(f);
        return [f, data];
    });

    const entries = await Promise.all(promises);

    return Object.fromEntries(entries);
}
