import { useMemo, useState } from "react"
import { type DemographicLabel, type Demographics } from "../domain"
import { getValueFromLabel } from "../services"
import { interpolateBlues } from "d3"
import { DemographicTable } from "./DemographicTable"

export const MobileBottom = ({
    
    selectedRegion
    , selectedRegionDemoData
    , maxPctColourScale
    , selectedDemographic
    }:
    {
    selectedDemographic: DemographicLabel
    , selectedRegion: string
    , selectedRegionDemoData: Demographics | null | undefined
    , maxPctColourScale: number
    }) => {


    const [toggleStatsTabMobile, setToggleStatsTabMobile] = useState<boolean>(false);

    const selectedDemographicPercentage = useMemo(()=>{

        let demoVal = getValueFromLabel(selectedDemographic);
        if (selectedRegionDemoData && demoVal) 
            return (selectedRegionDemoData[demoVal].pct * 100).toFixed(2)
        return 0


    }, [selectedDemographic, selectedRegion])

    return (

        <div className= " absolute bottom-0 w-full max-h-3/4 md:hidden overflow-y-scroll">
            <div 
                className="absolute right-0 m-2 p-1 border border-gray-600 bg-gray-100 text-sm cursor-pointer"
                onClick={()=>setToggleStatsTabMobile(!toggleStatsTabMobile)}
            >
                {toggleStatsTabMobile ? "Hide" : "Show"}
            </div>
            <div className="flex-1 text-center bg-gray-600 pt-10 rounded-md m-auto p-5 text-gray-100">
                <h1 className="flex-1 text-center text-lg font-medium">{selectedRegion}</h1>

                <p className="" > 
                    { selectedDemographic}: { selectedDemographicPercentage }%,
                     Population: {selectedRegionDemoData?.total.toLocaleString()}
                </p>
                                
                <div className="flex mt-1 flex-row"> 
                    <div className="flex-1 text-left ">0.00% </div> 
                    <div className="flex-1 text-right">{ (maxPctColourScale * 100).toFixed(2) }%</div> 
                </div>
                <div className="flex flex-row h-5 w-full ">
                    { 
                        ([0, 0.2, 0.4, 0.6, 0.8, 1].map((n, i)=>                    
                            <div key={i} className="flex-1" style={{backgroundColor: interpolateBlues(n)}}></div>
                                        
                        )) 
                    }
                </div>
                <div className="text-black bg-gray-300/100 px-5 font-right">
                        { toggleStatsTabMobile && <DemographicTable demographic={selectedRegionDemoData} />}
                </div>
            </div>            
        </div>
    )
}