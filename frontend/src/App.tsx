
import { Header } from './components/Header'
import { Map } from './components/Map';
import { About } from './components/About';
import { useState, useEffect } from 'react';
import { getMapData } from './services/mapLoad';
import { Loading } from './components/Loading'


export default function App() {

  const [displayAbout, setDisplayAbout] = useState(false)

  const [data, setData] = useState<any>(null);
  const [runAnimation, setRunAnimation] = useState<any>(null)
  
      useEffect(() => {
          getMapData()
          .then((data) => {
              setData(data);
              setRunAnimation(false);
              setTimeout(function() {
                  setRunAnimation(true);
                }, 1000);

          })
          .catch((err) => {
              console.error("Error loading files:", err);
          });
      }, []);
  

  return (
    
    <>
    <div className="flex flex-col h-dvh md:h-screen bg-gray-100">

      <Header onShowAbout={setDisplayAbout}/>
      {(runAnimation != true) && <div className={` transition-opacity duration-1000 ${runAnimation == false ? 'opacity-0' : 'opacity-100'}`}><Loading/></div>}

      {data && <div className={`flex-1 min-h-0 transition-opacity duration-1000 ${runAnimation ? 'opacity-100' : 'opacity-0'}`}> <Map data={data} /></div> }

        
      {displayAbout && <About onShowAbout={setDisplayAbout}/> }
      
      </div>
    </>
  )
}

/*
<div className="flex flex-col h-dvh md:h-screen bg-gray-100">

      <Header onShowAbout={setDisplayAbout}/>
      {(runAnimation != true) && <div className={` transition-opacity duration-1000 ${runAnimation == false ? 'opacity-0' : 'opacity-100'}`}><Loading/></div>}

      {data && <div className={`flex-1 min-h-0 transition-opacity duration-1000 ${runAnimation ? 'opacity-100' : 'opacity-0'}`}> <Map data={data} /></div> }

        
      {displayAbout && <About onShowAbout={setDisplayAbout}/> }
      
      </div>



      <div className="flex flex-col h-dvh md:h-screen bg-gray-100">

      <MultiSelect></MultiSelect>
      
      </div>

*/