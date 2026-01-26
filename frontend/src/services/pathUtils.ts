import data_max_pct from  "../../../data-api/data/area_ethnicity/max_pct_by_area.json";
import { getValueFromLabel } from '../services';
import { type MapLevel, type Demographics, type DemographicValue, type Stats } from "../domain";
import * as d3 from "d3";

export const calculateStrokeWidth = (zoom_factor: number, selected: boolean): number => {

    const STROKE_WIDTH_UNSELECTED_MOD = 0.00005;
    const STROKE_WIDTH_SELECTED_MOD = 1;

        
    let selected_calc = STROKE_WIDTH_SELECTED_MOD /(zoom_factor);
    let unselected_calc = STROKE_WIDTH_UNSELECTED_MOD * zoom_factor;

    if (selected) // Return 
        return Math.max(selected_calc, unselected_calc);
    else
        return unselected_calc;

}

export const renderEthnicityColour = (
    demographics : Demographics | undefined
    , ethnicity: any
    , level : MapLevel): any => {

    let max_pct_map;

        
    if (level == "Regions") 
        max_pct_map = data_max_pct.region;
    else if (level == "Territorial") 
        max_pct_map = data_max_pct.territorial;
    else if (level == "SA3")
        max_pct_map = data_max_pct.sa3;
    else
        max_pct_map = data_max_pct.sa2;



    if (demographics === undefined) { // No people live here
        return "var(--color-gray-400)"; //"white"

    } else {
            
        let key : DemographicValue | undefined = getValueFromLabel(ethnicity)
        if (key == undefined) {
            return "white";
        } else {
            let stat: Stats = demographics[key];
            let max_pct = max_pct_map[key];
            let colorScale = d3
                .scaleSequential(d3.interpolateBlues)
                .domain([0, max_pct]);

            return colorScale(stat.pct); 
        }    
    }      
}


export const updateAllPaths = (g : SVGGElement, zoom_factor: number): void => {
    d3.select(g)
        .selectAll("path")
        .attr("stroke", "var(--color-gray-400)")
        .attr("stroke-width",calculateStrokeWidth(zoom_factor, false)); 
}

export const updateSelectedPath = (path: SVGPathElement, zoom_factor: number): void => {
    d3.select(path)
        .attr("stroke",  "black")
        .attr("stroke-width", calculateStrokeWidth(zoom_factor, true) ) // 2
        .raise();
}

export const removeSelectedPath = (path: SVGPathElement, zoom_factor: number): void => {
    d3.select(path)
        .attr("stroke",  "var(--color-gray-400)")
        .attr("stroke-width", calculateStrokeWidth(zoom_factor, false));
}


export const updatePathColour = (g : SVGGElement, ethnicity : any): void => {
    d3.select(g)
        .selectAll("path[data-demo]")
        .attr("fill", function (){
        if (this != null) {
            const attr = (this as SVGPathElement).getAttribute("data-demo");
            const level = (this as SVGPathElement).getAttribute("data-level");
            if (attr != null && level != null) {
                return renderEthnicityColour(JSON.parse(attr) as Demographics, ethnicity, (level as MapLevel));
            }     
        }
    });
}

