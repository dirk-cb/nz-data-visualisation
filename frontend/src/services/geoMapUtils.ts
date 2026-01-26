import { geoPath, geoMercator } from "d3-geo";

const WIDTH = 975;
const HEIGHT = 610;

const projection = geoMercator()
    .center([174, -41])
    .scale(1500)
    .translate([WIDTH / 2, HEIGHT / 2]);

export const pathGenerator = geoPath(projection);
