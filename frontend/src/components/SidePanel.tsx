import { type Demographics } from "../domain"
import { DemographicTable } from "./DemographicTable";

export function SidePanel({demographic, toggle}: { demographic: Demographics | null | undefined, toggle: any })  {

    if (!demographic)
        return (<></>);

    return (

        <div className= " absolute bottom-3 right-3 w-4/13 shadow-sm/75 ">
            <div className=" bg-gray-600/100   px-5 pt-3   text-gray-100 ">
                <div 
                    className="absolute right-0 pr-5 text-4xl font-[Arial] cursor-pointer hover:text-red-300"
                    onClick={()=>toggle(false)}
                >✖</div>
                            
                <h1 className="text-left text-xl lg:text-3xl pb-2 mr-8">{demographic && demographic.area_name}</h1> 
                <h2 className="text-left text-md lg:text-xl pb-2">Overview</h2>

                        

            </div>
            <div className=" bg-gray-300/100  px-5 pt-3 pb-6 text-black ">
                <DemographicTable demographic={demographic} />
            </div>
        </div>  
    )

}

