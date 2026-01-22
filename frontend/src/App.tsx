
import { Header } from './components/Header'
import { Map } from './components/Map';
import { About } from './components/About';
import { useState, useEffect } from 'react';
import { getMapData } from './services/mapLoad';


export default function App() {

  const [displayAbout, setDisplayAbout] = useState(false)

  const [data, setData] = useState<any>(null);
  
      useEffect(() => {
          getMapData()
          .then((data) => {
              setData(data);
          })
          .catch((err) => {
              console.error("Error loading Parquet files:", err);
          });
      }, []);
  

  return (
    
    <>
    <div className="flex flex-col h-dvh md:h-screen">

      <Header onShowAbout={setDisplayAbout}/>
      { data == null && "Loading" }

      { data !==  undefined  && data != null &&<div className="flex-1 min-h-0 "> <Map data={data} /></div> }
        
      {displayAbout && <About onShowAbout={setDisplayAbout}/> }
      
      </div>
    </>
  )
}