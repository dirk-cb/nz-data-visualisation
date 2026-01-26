import * as d3 from "d3";
import "d3-zoom";


export const defineZoom = (mapref: any, gref: any, renderRegion: any) => {

    const svg = d3.select(mapref);
    const g = d3.select(gref);
    const zoomBehavior = d3.zoom()
        .scaleExtent([1, 200]) 
        .on('zoom', (event) => {
            if (event.transform.k < 4) { // Region
                renderRegion("Regions");
            } else if (event.transform.k < 24) { // Territorial
                renderRegion("Territorial");
            } else if (event.transform.k < 64) { // SA3
                renderRegion("SA3");
            } else { // SA2
                renderRegion("SA2");
            }     
            g.attr("transform", event.transform);
        })
    svg.call((zoomBehavior as any));

}

export const getCurrentZoomFactor = (mapref: any) => {
    return d3.zoomTransform(mapref).k;
}