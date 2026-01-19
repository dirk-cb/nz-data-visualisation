
//import { useMemo } from "react";
import {useRef, useState, useEffect, useMemo } from 'react';
import { geoPath, geoMercator } from "d3-geo"; // type GeoPermissibleObjects
import { rewind } from "@turf/rewind";
import { type FeatureCollection } from "geojson";
import * as d3 from "d3";
import "d3-zoom";
import nz_region_with_ethnicity_data from  "../../../data-api/data/regions_with_ethnicity.json";
import sa3_with_ethnicity_data from "../../../data-api/data/sa3_with_ethnicity.json";

export function Map() {

    interface RegionEthnicity {

        area: string
        asian: number
        nz_european: number
        mena: number
        māori: number
        pasifika: number
        other: number
        total: number

    }


    const [regionLevel, setRegionLevel] = useState(1);

    const [ethnicity, setEthnicity] = useState("Asian");


    const regions = useMemo(() => {
        return (nz_region_with_ethnicity_data as FeatureCollection)
            .features
            .map(feature => rewind(feature, { reverse: true }));
    }, []);


    const sa3 = useMemo(() => {
        return (sa3_with_ethnicity_data as FeatureCollection)
            .features
            .filter(feature => feature.geometry != null)
            .map(feature => rewind(feature, { reverse: true }));
    }, []);


    const maximumPercentages = useMemo(() => {

        let ethnicityKeys = ["asian","nz_european", "mena", "māori", "pasifika", "other"]

        let maxs = {
            ethnicity:{

            }
        }

        for (let key of ethnicityKeys) {
            (maxs.ethnicity as any)[key] = sa3
                .map((x)=>(x as any).properties.ethnicity)
                .filter(x=>x)
                .map((x)=>x[key] / x["total"])
                .reduce((a,b)=>Math.max(a,b),0)
        }


        return  maxs;
    }, []);
    

    const [selectedRegion, setSelectedRegion] = useState("");


    const [selectedRegionEthnicity, setSelectedRegionEthnicity] = useState<RegionEthnicity | undefined | null>(undefined);

    const mapRef = useRef(null);
    // 975, 610
    const width = 975;
    const height = 610;

    //const [transform, setTransform] = useState(d3.zoomIdentity);
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

    const ethnicities = useMemo(
        () => ["Asian", "European", "MENA", "Māori", "Pasifika", "Other", "LGBT"],
        []
    );

    

    const renderEthnicityColour = (region: any): any => {



        if (!region.ethnicity) {

        } else {


            if (ethnicity == "Asian") {
                let max_percent = (maximumPercentages as any).ethnicity.asian
                const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, max_percent]);
                return colorScale(region.ethnicity.asian / region.ethnicity.total);
            }
            else if (ethnicity == "Māori") {
                let max_percent = (maximumPercentages as any).ethnicity.māori
                const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, max_percent]);
                return colorScale(region.ethnicity.māori / region.ethnicity.total);
            }
            else if (ethnicity == "European") {
                let max_percent = (maximumPercentages as any).ethnicity.nz_european
                const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, max_percent]);
                return colorScale(region.ethnicity.nz_european / region.ethnicity.total);
            }
            else if (ethnicity == "MENA") {
                let max_percent = (maximumPercentages as any).ethnicity.mena
                const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, max_percent]);
                return colorScale(region.ethnicity.mena / region.ethnicity.total);
            }
            else if (ethnicity == "Pasifika") {
                let max_percent = (maximumPercentages as any).ethnicity.pasifika
                const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, max_percent]);
                return colorScale(region.ethnicity.pasifika / region.ethnicity.total);
            }
            else if (ethnicity == "Other") {
                let max_percent = (maximumPercentages as any).ethnicity.other
                const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, max_percent]);
                return colorScale(region.ethnicity.other / region.ethnicity.total);
            }
           
        }

        if (region.lgbt) {
            const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 0.25]);

            if (ethnicity == "LGBT") 
                return colorScale(region.lgbt.lgbt / region.lgbt.total);

        }
         return "white"
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


    const updateRegion = (region: any, event: any) => {

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
        
        
        setSelectedRegion(region.properties.name)
        setSelectedRegionEthnicity(region.properties.ethnicity)

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
            .scaleExtent([1, 70]) 
            .on('zoom', (event) => {

                if (event.transform.k < 8) {
                    setRegionLevel(1)
                } else {
                    setRegionLevel(2)
                }

                //const current_xform = d3.zoomTransform(mapRef.current as any).k
                
                g.attr("transform", event.transform);
                //g.selectAll("path").attr("stroke-width", 0.5 / current_xform);

            })

        svg.call((zoomBehavior as any));
    }, []);

    
    const regionPathsSA3 = useMemo(() => {

        //const current_xform = d3.zoomTransform(mapRef.current as any).k

        return sa3.map((region: any, i: number) => (
            <path
            className="transition-[fill] duration-[500ms] ease-in-out"
            
            
            key={i}
            d={pathGenerator(region) ?? undefined}
            fill={renderEthnicityColour((region as any).properties as any)}


            stroke= "var(--color-gray-400)"
            strokeWidth="0.0625"    
    
            onMouseEnter={(e)=>updateRegion((region as any), e)}
            onMouseLeave={(e)=>removeRegion((region as any).properties.name, e)}
            />
        ));
    }, [sa3, ethnicity]);

        
    const regionPathsRegion = useMemo(() => {

        return regions.map((region: any, i: number) => (    
            <path 
                className=""
                cursor="pointer"
                strokeWidth="0.5"
                stroke="var(--color-gray-400)"
                fill={renderEthnicityColour((region.properties as any))}
                key={region.id ?? i}
                d={pathGenerator(region) ?? undefined}
                onMouseEnter={(e)=>updateRegion(region, e)}
                onMouseLeave={(e)=>removeRegion(region.properties.name, e)}
            />
        ));
    }, [regions, ethnicity]);

    return (
        <div className ="h-full w-full relative" >

            {selectedRegion==="" ? <></> :
            (
                <>
                    <div className= " absolute bottom-10 w-full hidden md:flex">
                        <div className="flex-1 text-center bg-gray-600/75 ml-50 mr-50 rounded-xl m-auto p-5 text-gray-100">
                            <h1 className="flex-1 text-center text-3xl ">{selectedRegion}</h1>
                            { selectedRegionEthnicity !== null && selectedRegionEthnicity !== undefined && (<div className="font-lg font-medium">
                                <p>NZ European: { ((selectedRegionEthnicity.nz_european / selectedRegionEthnicity.total) * 100).toFixed(2) }% </p>
                                <p>Māori: { ((selectedRegionEthnicity.māori / selectedRegionEthnicity.total) * 100).toFixed(2) }%  </p>
                                <p>Asian: { ((selectedRegionEthnicity.asian / selectedRegionEthnicity.total) * 100).toFixed(2) }%  </p>
                                <p>Pasifika: { ((selectedRegionEthnicity.pasifika / selectedRegionEthnicity.total) * 100).toFixed(2) }%  </p>
                                <p>MENA: { ((selectedRegionEthnicity.mena / selectedRegionEthnicity.total) * 100).toFixed(2) }%  </p>
                                <p>Other: { ((selectedRegionEthnicity.other / selectedRegionEthnicity.total) * 100).toFixed(2) }%  </p>
                            </div>) }
                            
                        </div>
                        
                    </div>
                    <div className= " absolute bottom-0 w-full md:hidden bg-red-100">
                        <div className="flex-1 text-center bg-gray-600/75  m-auto p-5 text-gray-100">
                            <h1 className="flex-1 text-center text-lg ">{selectedRegion}</h1>
                            { selectedRegionEthnicity !== null && selectedRegionEthnicity !== undefined && (<div className="font-lg font-medium">
                                Euro: { ((selectedRegionEthnicity.nz_european / selectedRegionEthnicity.total) * 100).toFixed(2) }% 
                                Māori: { ((selectedRegionEthnicity.māori / selectedRegionEthnicity.total) * 100).toFixed(2) }% 
                                Asian: { ((selectedRegionEthnicity.asian / selectedRegionEthnicity.total) * 100).toFixed(2) }%
                                Pasifika: { ((selectedRegionEthnicity.pasifika / selectedRegionEthnicity.total) * 100).toFixed(2) }%
                                MENA: { ((selectedRegionEthnicity.mena / selectedRegionEthnicity.total) * 100).toFixed(2) }%
                                Other: { ((selectedRegionEthnicity.other / selectedRegionEthnicity.total) * 100).toFixed(2) }%
                            </div>) }
                            
                        </div>
                        
                    </div>
                </>
            )}

            {<div className= " absolute left-0 ">
                    <div className="mt-5 bg-gray-600/100 ml-5 rounded-xl px-5 pt-3 pb-6 text-gray-100">
                        <h1 className="text-center text-xl pb-2">Choose a demographic</h1> 

                        <select className="bg-gray-100 text-black p-2 rounded-lg w-full " onChange={(v)=>setEthnicity(v.target.value)}>
                            {ethnicities.map((val)=>(<option value={val} key={val} >{val}</option>))}
                        </select>
                    </div>
            </div>}

            <div className="h-full bg-gray-100 cursor-grab active:cursor-grabbing" onMouseMove={updateMouse}>
            
                <svg className="" ref={mapRef} viewBox="0 0 975 610" height="100%" width="100%" > 
                    <g ref={gRef} >
                        { regionLevel == 1 && regionPathsRegion }
                        { regionLevel == 2 && regionPathsSA3} 
                    </g>
                </svg>
                
            </div>
        </div>
        

    )

}

