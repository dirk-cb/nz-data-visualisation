import nz from '../assets/NZ_Placeholder.png';

export function Loading() {

    return (
        <div className="flex items-center justify-center bg-gray-100  w-full overflow-hidden animate-[pulse_1.5s_ease-in-out_infinite]">
            <img 
            className="absolute bottom-0 h-9/10 w-auto object-contain" 
            src={nz} 
            alt="Loading NZ Map"
        />
            <div className="absolute bottom-1/2 text-3xl">Loading Data</div>
</div>
    )

}

