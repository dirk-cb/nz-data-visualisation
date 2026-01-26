

import { getValueFromLabel } from "../services"
import { type Demographics, type DemographicLabel } from "../domain"


export const HighlightedRegion = ({
    selectedDemographic
    , selectedRegion
    , selectedRegionDemoData
    }:
    {
    selectedDemographic: DemographicLabel
    , selectedRegion: string
    , selectedRegionDemoData: Demographics | null | undefined
    }) => {

    const regionHasData = selectedRegionDemoData !== null && selectedRegionDemoData !== undefined;

    return (
        <div className="z-2">
            <div className= " absolute bottom-10 left-1/3 w-1/3 hidden md:flex">
                <div className="flex-1 text-center bg-gray-600/75 rounded-xl m-auto p-5 text-gray-100">
                    <h1 className="flex-1 text-center text-3xl ">{selectedRegion}</h1>
                    {
                        regionHasData && (
                            <div className="font-lg font-medium">
                            <p>{selectedDemographic}: { (selectedRegionDemoData[getValueFromLabel(selectedDemographic)!].pct * 100).toFixed(2) }% </p>
                            <p>Population: { selectedRegionDemoData.total.toLocaleString() } </p>
                            </div>
                        ) 
                    }                   
                </div>                
            </div>
        </div>
    )
}