
import { useState } from 'react';

interface HeaderProps {
    onShowAbout: (view: boolean) => void;
}



export function Header({ onShowAbout }: HeaderProps) {

    
    const [hamburger, setHamburger] = useState(false)
    
    return (
    <div className="relative z-50">
        <div className="flex flex-row bg-gray-600 text-gray-100 ">
            <div className="text-4xl font-bold font-[Segoe UI] italic text-gray-100 flex-auto self-end p-5">
                <span className="ml-5">Census Visualiser Tool</span>
            </div>
            <div className="hidden md:flex flex-10 flex flex-row text-xl italic ">
                <div className="px-7 self-end cursor-pointer hover:text-gray-300 hover:underline p-5">Home</div>
                <div className="px-7 self-end cursor-pointer hover:text-gray-300 hover:underline p-5" onClick={() => onShowAbout(true)}>About</div>
            </div>
            <div className=" md:hidden flex pr-5">
                <button type="button" className="" onClick={()=>setHamburger(!hamburger)}>
                <svg className="w-8 h-8" viewBox="0 0 24 24" width="24" height="24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                </svg>
                
                </button>
            </div>

            
        </div>
        {hamburger && 
            <div className="absolute w-full top-full bg-gray-200 w-30 ">
                <div className="px-7 self-end cursor-pointer hover:text-gray-300 hover:underline p-2" onClick={() => {
                    setHamburger(false)
                    onShowAbout(false)
                }}>Home</div>
                <div className="px-7 self-end cursor-pointer p-2" onClick={() => {
                    setHamburger(false)
                    onShowAbout(true)
                }}>About</div>
            </div>
        }
    </div>
    )


}

