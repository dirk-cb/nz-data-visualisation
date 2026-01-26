import { useRef, useState, useEffect, useMemo } from 'react';

import * as d3 from "d3";

// Components
import { TabbedDemographicSelect, ToggleZoom } from "./SelectBox"
import { Path } from './Path';
import { SidePanel } from './SidePanel';
import { HighlightedRegion } from './HighlightedRegion';
import { MobileBottom } from './MobileBottom';

import { 
    type FeatureCollectionEthnicity
    , type FeatureEthnicity
    , type Demographics
    , type DemographicValue 
    , type DemographicLabel
    , type MapLevel
    , type MapLevelSettings
    , type MapData
} from "../domain"

import { 
    updateAllPaths
    , updateSelectedPath
    , removeSelectedPath
    , updatePathColour 
    , getValueFromLabel
    , determineMapToRender
    , determineMaxColourPercentage
    , defineZoom
    , getCurrentZoomFactor
} from '../services';

const DEFAULT_ETHNICITY = "Asian";
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

export function Map({data}: {data: MapData}) {

    const [regionLevel, setRegionLevel] = useState<MapLevel>("Regions"); // Which 
    const [demographic, setDemographic] = useState<DemographicLabel>(DEFAULT_ETHNICITY); // Ethnicity user selected via dropdown
    const [selectedRegionDemoData, setSelectedRegionDemoData] = useState<Demographics | undefined | null>(undefined); // highlighted
    const [displayedRegionStats, setDisplayedRegionStats] = useState<Demographics | undefined | null>(undefined); // clicked
    const [toggleStatsTab, setToggleStatsTab] = useState<boolean>(false);
    const [mapSettings, setMapSettings] = useState<MapLevelSettings>("Default");
    const [selectedRegion, setSelectedRegion] = useState("");

    const selectedRegionRef = useRef(null); // Work around to un-highlight regions due to onMouseLeave behaviour
    const mapRef = useRef(null); // SVG
    const gRef = useRef<SVGGElement | null>(null); // Main container for paths

    // Calls function to define the zoom behaviour
    useEffect(() => {
        defineZoom(mapRef.current, gRef.current, setRegionLevel)
    }, []);

    // Every time the ethnicity, regionLevel or the selected map in the map settings changes
    // the maximum colour scale percentage needs to be displayed to the screen
    const maxPctColourScale = useMemo(() => {
        let key : DemographicValue | undefined = getValueFromLabel(demographic)
        return determineMaxColourPercentage(regionLevel, mapSettings, key)
    }, [demographic, regionLevel, mapSettings]);


    // When the mouse enters an area, logic to change border colours
    const updateRegion = (region: FeatureEthnicity, event: any) => {

        const new_region = event.target;

        if (gRef.current)
            updateAllPaths(gRef.current, getCurrentZoomFactor(mapRef.current));

        updateSelectedPath(new_region, getCurrentZoomFactor(mapRef.current));
        
        selectedRegionRef.current = region.properties.name;
        setSelectedRegion(region.properties.name);
        setSelectedRegionDemoData(region.properties.demographics);

    }

    // When the mouse leaves an area, logic to change border colours
    const removeRegion = (name: string, event: any) => {

        // Do not unselect a region if on mobile due to onMouseLeave behaviour
        if (name == selectedRegionRef.current && !IS_MOBILE) {
            setSelectedRegion("");
            setSelectedRegionDemoData(null);
        }
        
        removeSelectedPath(event.target, getCurrentZoomFactor(mapRef.current))

    }

    
    // Update the path fill colours upon the selected demographic changing
    useEffect(() => {
        if (gRef.current)
            updatePathColour(gRef.current, demographic);
    }, [demographic]);


    // Re-usable props for the different paths
    const getRegionProps = (region: FeatureEthnicity) => ({
        region: region,
        
        onMouseEnter: (e: React.MouseEvent) => updateRegion(region, e),
        onMouseLeave: (e: React.MouseEvent) => removeRegion(region.properties.name, e),
        onClick: (e: React.MouseEvent) => {
            updateRegion(region, e);
            setToggleStatsTab(true);
            setDisplayedRegionStats(region.properties.demographics);
        }
    });
    
    /*
    Generate the paths for each map
    */
    const pathsRegion = useMemo(() => {
        return (data.region as FeatureCollectionEthnicity)
                .features.map((region: FeatureEthnicity, i: number) => (    
            <Path mapLevel="Regions" key={region.id || i} {...getRegionProps(region)} />
        ));
    }, []); 

    const pathsTerritorial = useMemo(() => {
        return (data.territorial as FeatureCollectionEthnicity)
                .features.map((region: FeatureEthnicity, i: number) => (    
            <Path mapLevel="Territorial" key={region.id || i} {...getRegionProps(region)} />
        ));
    }, []); 

    const pathsSA3 = useMemo(() => {
        return (data.sa3 as FeatureCollectionEthnicity)
                .features.map((region: FeatureEthnicity, i: number) => (    
            <Path mapLevel="SA3" key={region.id || i} {...getRegionProps(region)} />
        ));
    }, []); 

    const pathsSA2 = useMemo(() => {
        return (data.sa2 as FeatureCollectionEthnicity)
                .features.map((region: FeatureEthnicity, i: number) => (    
            <Path mapLevel="SA2" key={region.id || i} {...getRegionProps(region)} />
        ));
    }, []); 

    return (
        <div className ="h-full w-full relative select-none" >

            {/* Render the demographic table in the bottom right corner on desktop */}
            { toggleStatsTab && <div className="md:block hidden" ><SidePanel demographic={displayedRegionStats} toggle={setToggleStatsTab} /></div>}
          
            
            { /* Render the options the top left */}
            {
                <div className= " absolute left-0">
                
                    <div className="mt-5 bg-gray-600/100 ml-5 rounded-xl px-5 pt-3 pb-6 text-gray-100 ">
                        <div className="absolute right-0 top-5 z-2">
                        < ToggleZoom zoomSetting={mapSettings} setZoomSetting={setMapSettings} />
                        </div>
                        <div className="text-black">
                        < TabbedDemographicSelect setValueSelected={setDemographic}/>
                        
                        </div>
                        <div className="mt-4 flex-row hidden md:flex"> 
                            <div className="flex-1 text-left ">0.00% </div> 
                            <div className="flex-1 text-right">{ (maxPctColourScale * 100).toFixed(2) }%</div> 
                        </div>
                        <div className="hidden md:flex flex-row h-5 w-full ">
                        { 
                            ([0, 0.2, 0.4, 0.6, 0.8, 1].map((n, i)=>
                                    <div key={i} className="flex-1" style={{backgroundColor:d3.interpolateBlues(n)}}></div>      
                            )) 
                        }
                        </div>

                    </div>
                </div>
            }

            {/* Render the hover option */}
            {selectedRegion && <HighlightedRegion selectedRegion={selectedRegion} selectedDemographic={demographic} selectedRegionDemoData={selectedRegionDemoData} />}

            {/* Render mobile bottom */}
            { selectedRegion && <MobileBottom maxPctColourScale={maxPctColourScale} selectedRegion={selectedRegion} selectedDemographic={demographic} selectedRegionDemoData={selectedRegionDemoData}/>}

            {/* Render each map */}
            <div className="h-full bg-gray-400 cursor-grab active:cursor-grabbing">
                <svg className="" ref={mapRef} viewBox="0 0 975 610" height="100%" width="100%" > 
                    <g ref={gRef} >
                        <g className={determineMapToRender(regionLevel, mapSettings, "Regions") }>{pathsRegion}</g>
                        <g className={determineMapToRender(regionLevel, mapSettings, "Territorial") }>{pathsTerritorial}</g>
                        <g className={determineMapToRender(regionLevel, mapSettings, "SA3") }>{pathsSA3}</g>
                        <g className={determineMapToRender(regionLevel, mapSettings, "SA2") }>{pathsSA2}</g>
                    </g>
                </svg>
                
            </div>
        </div>
        

    )

}