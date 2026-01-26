 
import { type Feature, type FeatureCollection } from "geojson";

    const DEMOGRAPHIC_LABELS = [
        "MENA",
        "Other Ethnicity",
        "Paifika",
        "Asian",
        "European",
        "Māori",
        "Chinese",
        "Indian",
        "Filipino",
        "Other Asian",
        "LGBT",
        "Non LGBT",
        "No Religion",
        "Christian",
        "Islam",
        "Judaism",
    ];

    export interface Stats {
        count: number;
        pct: number;
    };

    export interface Demographics {
        area_name: string;
        area_code: string;
        mena: Stats;
        other_ethnicity: Stats;
        pasifika: Stats;
        asian: Stats;
        nz_european: Stats;
        māori: Stats;
        chinese: Stats;
        indian: Stats;
        filipino: Stats;
        other_asian: Stats;
        lgbt: Stats;
        non_lgbt: Stats;
        no_religion: Stats;
        christian: Stats;
        islam: Stats;
        judaism: Stats;
        total: number;
    };

    export type DemographicLabel = typeof DEMOGRAPHIC_LABELS[number];
    export type DemographicValue = { [K in keyof Demographics]: Demographics[K] extends Stats ? K : never}[keyof Demographics];

    export interface DemographicOptions {
        label: DemographicLabel;
        value: DemographicValue;
        cat: "Ethnicity" | "Religion" | "Other"; // Category
        suboption: boolean; // Whether to indent in the menu
    };

    type FlexibleProperties = {
        //id: string;
        demographics?: Demographics;
    } & Record<string, any>;

    export interface FeatureEthnicity extends Feature {
        properties: FlexibleProperties;
    }

    export interface FeatureCollectionEthnicity extends FeatureCollection {
        features: FeatureEthnicity[];
    };


