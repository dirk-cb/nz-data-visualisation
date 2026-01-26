/*
    Defines the logic of which map level to render based on the
    region options
*/
import { type MapLevel, type MapLevelSettings, type DemographicValue} from "../domain"
import MaxPercentageForRegionEthnicities from  "../../../data-api/data/area_ethnicity/max_pct_by_area.json";

export const determineRegion = (zoomMapLevel: MapLevel, selectedMapLevel: MapLevelSettings): MapLevel => {
    if (selectedMapLevel == "Default")
        return zoomMapLevel;
    else 
        return selectedMapLevel;
}

export const determineMapToRender = (zoomMapLevel: MapLevel, selectedMapLevel: MapLevelSettings, displayMap: MapLevel): "block" | "hidden" => {
    
    return determineRegion(zoomMapLevel, selectedMapLevel) == displayMap ? "block" : "hidden";
    
}

export const determineMaxColourPercentage = (
    zoomMapLevel: MapLevel
    , selectedMapLevel: MapLevelSettings
    , currentSelectedDemographicKey: DemographicValue | undefined): number => {

    // Invalid demographic Key
    if (currentSelectedDemographicKey == undefined) {
        return -1;
    } else {
        // Determine which map is currently rendered to the screen
        const currentMap = determineRegion(zoomMapLevel, selectedMapLevel);

        let maxPct;

        // Decide which max percent to render
        if (currentMap == "Regions")
            maxPct = MaxPercentageForRegionEthnicities.region;
        else if (currentMap == "Territorial")
            maxPct = MaxPercentageForRegionEthnicities.territorial;
        else if (currentMap == "SA3") 
            maxPct = MaxPercentageForRegionEthnicities.sa3;
        else if (currentMap == "SA2") // SA2
            maxPct = MaxPercentageForRegionEthnicities.sa2;
        else 
            return -1;

        return maxPct[currentSelectedDemographicKey];
    }
}