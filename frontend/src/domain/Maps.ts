export type MapLevel = "Regions" | "Territorial" | "SA3" | "SA2";

export type MapLevelSettings = "Regions" | "Territorial" | "SA3" | "SA2" | "Default";

export interface MapData {
    region: Object;
    territorial: Object;
    sa3: Object;
    sa2: Object;
};