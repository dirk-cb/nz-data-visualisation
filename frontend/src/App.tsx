
import { Header } from './components/Header'
import { Map } from './components/Map';
import { About } from './components/About';
import { useState } from 'react';


export default function App() {

  const [displayAbout, setDisplayAbout] = useState(false)
  

  return (
    
    <>
      <div className="flex flex-col h-dvh md:h-screen">
        <Header onShowAbout={setDisplayAbout}/>
       
        <div className="flex-1 min-h-0 ">
          
          <Map />
        </div>  
         { displayAbout && <About onShowAbout={setDisplayAbout}/>} 
        
    </div>
    </>
  )
}