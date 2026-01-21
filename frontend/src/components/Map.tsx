
//import { useMemo } from "react";
import {useRef, useState, useEffect, useMemo } from 'react';
import { geoPath, geoMercator } from "d3-geo"; // type GeoPermissibleObjects

import { type FeatureEthnicity, type Demographics, type Stats } from "../domain/FeatureEthnicity"
import * as d3 from "d3";
import "d3-zoom";
import data_max_pct from  "../../public/data/max_pct_by_area.json";

export function Map({data}: any) {

    
    const ethnicities = useMemo(
        () => ["Asian", "European", "MENA", "Māori", "Pasifika", "Other", "LGBT", "No Religion", "Christian", "Islam", "Judaism"],
        []
    );

    type EthnicityLabel = (typeof ethnicities)[number];
    type DemoValue = { [K in keyof Demographics]: Demographics[K] extends Stats ? K : never}[keyof Demographics] & string

    const [regionLevel, setRegionLevel] = useState<number>(1);
    const [ethnicity, setEthnicity] = useState<EthnicityLabel>("Asian");
    const [selectedRegionEthnicity, setSelectedRegionEthnicity] = useState<Demographics | undefined | null>(undefined); // highlighted

    const [displayedRegionStats, setDisplayedRegionStats] = useState<Demographics | undefined | null>(undefined); // clicked
    const [toggleStatsTab, setToggleStatsTab] = useState<boolean>(false);
    const [toggleStatsTabMobile, setToggleStatsTabMobile] = useState<boolean>(false);

    const LabelMappings: Record<EthnicityLabel, DemoValue> = useMemo(() => ({
        "Asian": "asian",
        "European": "nz_european",
        "MENA": "mena",
        "Māori": "māori",
        "Pasifika": "pasifika",
        "Other": "other_ethnicity",
        "LGBT": "lgbt",
        "No Religion": "no_religion",
        "Christian": "christian",
        "Islam": "islam",
        "Judaism": "judaism",
    }), []);

    const ReverseLabelMappings: Record<DemoValue, EthnicityLabel> = useMemo(() => {
        let reverse = {} as Record<string, EthnicityLabel>;

        for (let key in LabelMappings) {

            let value = (LabelMappings[key as DemoValue] as EthnicityLabel)

            reverse[value] = key as DemoValue
        }

        return reverse;

    }, []);

    const Ethnicities: DemoValue[] = useMemo((()=>["asian", "nz_european", "mena", "māori", "pasifika", "other_ethnicity"]), [])

    const Religions: DemoValue[] = useMemo((()=>["christian", "no_religion", "islam", "judaism"]), [])


    const [selectedRegion, setSelectedRegion] = useState("");

    const mapRef = useRef(null);
    // 975, 610
    const width = 975;
    const height = 610;

    const gRef = useRef<SVGGElement | null>(null);

    const projection = useMemo(() => {
    return geoMercator()
        .center([174, -41])
        .scale(1500)
        .translate([width / 2, height / 2]);
    }, [width, height]);

    const pathGenerator = useMemo(() => {
        return geoPath(projection);
    }, [projection]);
    

    const renderEthnicityColour = (demographics : Demographics | undefined, level : string): any => {

        let max_pct_map;


        if (level == "1") { // Region
            max_pct_map = data_max_pct.region
        } else if (level == "2") { // Territorial
            max_pct_map = data_max_pct.territorial
        } else if (level == "3") { // SA3
            max_pct_map = data_max_pct.sa3
        } else { // SA2
            max_pct_map = data_max_pct.sa2
        } 



        if (demographics === undefined) { // No people live here
            return "white"

        } else {
            
            let key : DemoValue = LabelMappings[ethnicity]
            let stat: Stats = demographics[key]
            let max_pct = max_pct_map[key]
            let colorScale = d3.scaleSequential(d3.interpolateBlues)
                .domain([0, max_pct])


            return colorScale(stat.pct);
           
        }

        
    }



  
    const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });

    const updateMouse = (e: any) => {
        setMouseCoord({ x: e.clientX, y: e.clientY });
    };




    useEffect(() => {

        const current_xform = d3.zoomTransform(mapRef.current as any).k
        d3.select(gRef.current)
            .selectAll("path")
            .attr("stroke-width", 0.5 / current_xform);

        
        if (mouseCoord.x!=0 && mouseCoord.y!=0) {

            const point = (mapRef.current as any).createSVGPoint()

            point.x = mouseCoord.x
            point.y = mouseCoord.y

            d3
                .select(gRef.current)
                .selectAll("path")
                .filter(function() {
                    const matrix = (this as SVGPathElement).getScreenCTM();
                    if (!matrix)
                        return false
                    const localPoint = point.matrixTransform(matrix.inverse());
                    return (this as SVGPathElement).isPointInFill(localPoint);
                    
                    
                })
                .attr("stroke", "black")
                .attr("stroke-width", 0.5/8)
                .raise()
                /*

                */

        }
            
        
    }, [regionLevel]);

     const maxPctColourScale = useMemo(() => {

        let max_pct_map;
        let key : DemoValue = LabelMappings[ethnicity]

        

        if (regionLevel == 1) { // Region
            max_pct_map = data_max_pct.region
        } else if (regionLevel == 2) { // Territorial
            max_pct_map = data_max_pct.territorial
        } else if (regionLevel == 3) { // SA3
            max_pct_map = data_max_pct.sa3
        } else { // SA2
            max_pct_map = data_max_pct.sa2
        } 

        return max_pct_map[key];
    }, [ethnicity, regionLevel]);


    const updateRegion = (region: FeatureEthnicity, event: any) => {

        const new_region = event.target;

        const current_xform = d3.zoomTransform(mapRef.current as any).k

        d3.select(new_region.parentNode)
            .selectAll("path")
            .attr("stroke", "var(--color-gray-400)")
            .attr("stroke-width", 0.5 / current_xform);

        d3.select(new_region).raise() // Show it first
        d3.select(new_region)
            .attr("stroke",  "black")
            .attr("stroke-width", 1 / current_xform) // 2
        
        
        setSelectedRegion(region.name)
        setSelectedRegionEthnicity(region.demographics)

    }



    const removeRegion = (name: string, event: any) => {

        const current_xform = d3.zoomTransform(mapRef.current as any).k

        if (name == selectedRegion)
            setSelectedRegion("")
        d3.select(event.target)
            .attr("stroke",  "var(--color-gray-400)")
            .attr("stroke-width", 0.5 / current_xform)
    }


    useEffect(() => {

        const svg = d3.select(mapRef.current);
        const g = d3.select(gRef.current);

        const zoomBehavior = d3.zoom()
            .scaleExtent([1, 200]) 
            .on('zoom', (event) => {

                if (event.transform.k < 4) { // Region
                    setRegionLevel(1)
                } else if (event.transform.k < 24) { // Territorial
                    setRegionLevel(2)
                } else if (event.transform.k < 64) { // SA3
                    setRegionLevel(3)
                } else { // SA2
                    setRegionLevel(4)
                } 
                
                g.attr("transform", event.transform);

            })

        svg.call((zoomBehavior as any));
    }, []);


    // Update Ethnicity colours
    useEffect(() => {

        d3.select(gRef.current)
            .selectAll("path[data-demo]")
            .attr("fill", function (){

                if (this != null) {
                    const attr = (this as SVGPathElement).getAttribute("data-demo");
                    const level = (this as SVGPathElement).getAttribute("data-level");

                    if (attr != null && level != null) {
                        return renderEthnicityColour(JSON.parse(attr) as Demographics, level);

                    }     
                }
            })
    }, [ethnicity]); // regionLevel

    

    

    /*
    Generate the paths for each map
    */
    const pathsRegion = useMemo(() => {

        return data.region.map( (region: FeatureEthnicity, i: number) => (
        
        //(data.region as FeatureCollectionEthnicity)
               // .features.map((region: FeatureEthnicity, i: number) => (    
            
            <path 
                className="transition-[fill] duration-[1000ms] ease-in-out"
                cursor="pointer"
                strokeWidth="1"
                stroke="var(--color-gray-400)"
                data-level="1"
                data-demo={JSON.stringify(region.demographics)}
                fill={renderEthnicityColour(region.demographics, "1")}
                key={region.id ?? i}
                d={pathGenerator(region.geometry) ?? undefined}
                onMouseEnter={(e)=>updateRegion(region, e)}
                onMouseLeave={(e)=>removeRegion(region.name, e)}
                onClick={()=>{
                    setToggleStatsTab(true)
                    setDisplayedRegionStats(region.demographics)
                    }
                }
                
            />
        ));
    }, [data]); // ethnicity

    const pathsTerritorial = useMemo(() => {

        return data.territorial.map((region: FeatureEthnicity, i: number) => (    
            <path 
                className="transition-[fill] duration-[1000ms] ease-in-out"
                cursor="pointer"
                strokeWidth="0"
                stroke="var(--color-gray-400)"
                data-level="2"
                data-demo={JSON.stringify(region.demographics)}
                fill={renderEthnicityColour(region.demographics, "2")}
                key={region.id ?? i}
                d={pathGenerator(region.geometry) ?? undefined}
                onMouseEnter={(e)=>updateRegion(region, e)}
                onMouseLeave={(e)=>removeRegion(region.name, e)}
                onClick={()=>{
                    setToggleStatsTab(true)
                    setDisplayedRegionStats(region.demographics)
                    }
                }
                
            />
        ));
    }, []);

    const pathsSA3 = useMemo(() => {

        return data.sa3.map((region: FeatureEthnicity, i: number) => (    
            <path 
                className="transition-[fill] duration-[1000ms] ease-in-out"
                cursor="pointer"
                strokeWidth="0"
                stroke="var(--color-gray-400)"
                data-level="3"
                data-demo={JSON.stringify(region.demographics)}
                fill={renderEthnicityColour(region.demographics, "3")}
                key={region.id ?? i}
                d={pathGenerator(region.geometry) ?? undefined}
                onMouseEnter={(e)=>updateRegion(region, e)}
                onMouseLeave={(e)=>removeRegion(region.name, e)}
                onClick={()=>{
                    setToggleStatsTab(true)
                    setDisplayedRegionStats(region.demographics)
                    }
                }
            />
        ));
    }, []);

    const pathsSA2 = useMemo(() => {

        return data.sa2.map((region: FeatureEthnicity, i: number) => (    
            <path 
                className="transition-[fill] duration-[1000ms] ease-in-out"
                cursor="pointer"
                strokeWidth="0"
                stroke="var(--color-gray-400)"
                data-level="4"
                data-demo={JSON.stringify(region.demographics)}
                fill={renderEthnicityColour(region.demographics, "4")}
                key={region.id ?? i}
                d={pathGenerator(region.geometry) ?? undefined}
                onMouseEnter={(e)=>updateRegion(region, e)}
                onMouseLeave={(e)=>removeRegion(region.name, e)}
                onClick={()=>{
                    setToggleStatsTab(true)
                    setDisplayedRegionStats(region.demographics)
                    }
                }
            />
        ));
    }, []);


    const generateDemoTable = (demo: Demographics) => {
        return <div>
            <div className="my-1" >
                <span className="font-bold text-lg text-gray-600">Population </span> { (demo.total).toLocaleString() }
            </div>
            <div className="my-1">
                <span className="font-bold text-lg text-gray-600">LGBT </span> { (demo.lgbt.pct * 100).toFixed(2) }%
            </div>
            <table className="lg:table-fixed table-auto w-full ">
                <thead className="sticky top-0">
                  <tr className="bg-gray-500 text-gray-100 ">
                    <th className="p-0.5">Ethnicity</th>
                    <th className="p-0.5">%</th>
                    <th className="p-0.5">Count</th>
                  </tr>
                </thead>
                <tbody>
                {Ethnicities.sort((x,y)=>demo[y].pct - demo[x].pct).map((row, i)=>{
                  return  (<tr className="odd:bg-white even:bg-gray-200" key={i}>
                    <td className="p-0.5 pl-2 border-r-2 border-gray-400 ">{ReverseLabelMappings[row]}</td>
                    <td className="p-0.5 pl-2 border-r-2 border-gray-400 text-right pr-2">{(demo[row].pct * 100).toFixed(2)}%</td>
                    <td className="p-0.5 pl-2 text-right pr-2">{demo[row].count.toLocaleString()}</td>
                  </tr>)
                })}
                </tbody>
              </table>
              <table className="lg:table-fixed table-auto w-full mt-5">
                <thead className="sticky top-0">
                  <tr className="bg-gray-500 text-gray-100 ">
                    <th className="p-0.5">Religion</th>
                    <th className="p-0.5">%</th>
                    <th className="p-0.5">Count</th>
                  </tr>
                </thead>
                <tbody>
                {Religions.sort((x,y)=>demo[y].pct - demo[x].pct).map((row,i)=>{
                  return  (<tr className="odd:bg-white even:bg-gray-200" key={i}>
                    <td className="p-0.5 pl-2 border-r-2 border-gray-400 ">{ReverseLabelMappings[row]}</td>
                    <td className="p-0.5 pl-2 border-r-2 border-gray-400 text-right pr-2">{(demo[row].pct * 100).toFixed(2)}%</td>
                    <td className="p-0.5 pl-2 text-right pr-2">{demo[row].count.toLocaleString()}</td>
                  </tr>)
                })}
                </tbody>
              </table>
        </div>
    }



    return (
         <div className ="h-full w-full relative" >

            {!toggleStatsTab ? <></> : 
            <div>
                <div className= "md:block hidden absolute bottom-3 right-3 w-1/3 rounded-sm ">
                        <div className=" bg-gray-600/100 ml-5  px-5 pt-3  text-gray-100 ">
                            <div 
                                className="absolute right-0 pr-5 text-4xl font-[Arial] cursor-pointer"
                                onClick={()=>setToggleStatsTab(false)}
                            >✖</div>
                            
                            <h1 className="text-left text-xl lg:text-3xl pb-2 mr-8">{displayedRegionStats && displayedRegionStats.area_name}</h1> 
                            <h2 className="text-left text-md lg:text-xl pb-2">Overview</h2>

                        

                        </div>
                        <div className=" bg-gray-300/100 ml-5  px-5 pt-3 pb-6 text-black ">
                            { displayedRegionStats && (generateDemoTable(displayedRegionStats)) }
                        </div>
                </div>
                
            </div>}

            {selectedRegion==="" ? <></> :
            (
                <div className="z-2">
                    <div className= " absolute bottom-10 left-1/3 w-1/3 hidden md:flex">
                        <div className="flex-1 text-center bg-gray-600/75 rounded-xl m-auto p-5 text-gray-100">
                            <h1 className="flex-1 text-center text-3xl ">{selectedRegion}</h1>

                            {selectedRegionEthnicity !== null && selectedRegionEthnicity !== undefined && (<div className="font-lg font-medium">
                                <p>{ethnicity}: { (selectedRegionEthnicity[LabelMappings[ethnicity]].pct * 100).toFixed(2) }% </p>
                                <p>Population: { selectedRegionEthnicity.total.toLocaleString() } </p>
                            </div>) }
                            
                        </div>
                        
                    </div>
                    <div className= " absolute bottom-0 w-full max-h-3/4 md:hidden overflow-y-scroll">
                        <div 
                            className="absolute right-0 m-2 p-1 border border-gray-600 bg-gray-100 text-sm cursor-pointer"
                            onClick={()=>setToggleStatsTabMobile(!toggleStatsTabMobile)}

                        >{toggleStatsTabMobile ? "Hide" : "Show"}</div>
                        <div className="flex-1 text-center bg-gray-600 pt-10 rounded-md m-auto p-5 text-gray-100">
                            <h1 className="flex-1 text-center text-lg font-medium">{selectedRegion}</h1>
                             {selectedRegionEthnicity !== null && selectedRegionEthnicity !== undefined && (
                                <div className="font-sm">
                                 <p className="flex-1 text-center ">{ethnicity}: { (selectedRegionEthnicity[LabelMappings[ethnicity]].pct * 100).toFixed(2) }
                                    % , Population: { selectedRegionEthnicity.total.toLocaleString() }</p>
                                </div>
                            ) }
                        <div className="flex mt-1 flex-row"> 
                            <div className="flex-1 text-left ">0.00% </div> 
                            <div className="flex-1 text-right">{ (maxPctColourScale * 100).toFixed(2) }%</div> 
                        </div>
                        <div className="flex flex-row h-5 w-full ">
                        { 
                            ([0, 0.2, 0.4, 0.6, 0.8, 1].map((n, i)=>
                                
                                    <div key={i} className="flex-1" style={{backgroundColor:d3.interpolateBlues(n)}}></div>
                                
                            )) 
                        }
                        </div>
                        <div className="text-black bg-gray-300/100 px-5 font-right">
                            { displayedRegionStats && toggleStatsTabMobile && (generateDemoTable(displayedRegionStats)) }
                        </div>
                        </div>
                        
                    </div>
                </div>
            )}

            

            {<div className= " absolute left-0">
                    <div className="mt-5 bg-gray-600/100 ml-5 rounded-xl px-5 pt-3 pb-6 text-gray-100 ">
                        
                        <h1 className="text-center text-xl pb-2">Choose a demographic</h1> 

                        <select className="bg-gray-100 text-black p-2 rounded-lg w-full " onChange={(v)=>setEthnicity(v.target.value as EthnicityLabel)}>
                            {ethnicities.map((val)=>(<option value={val} key={val} >{val}</option>))}
                        </select>
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
            </div>}

            <div className="h-full bg-gray-100 cursor-grab active:cursor-grabbing" onMouseMove={updateMouse}>
            
                <svg className="" ref={mapRef} viewBox="0 0 975 610" height="100%" width="100%" > 
                    <g ref={gRef} >
                        <g className={regionLevel === 1 ? "block" : "hidden"}>{pathsRegion}</g>
                        <g className={regionLevel === 2 ? "block" : "hidden"}>{pathsTerritorial}</g>
                        <g className={regionLevel === 3 ? "block" : "hidden"}>{pathsSA3}</g>
                        <g className={regionLevel === 4 ? "block" : "hidden"}>{pathsSA2}</g>
                    </g>
                </svg>
                
            </div>
        </div>
        

    )

}
