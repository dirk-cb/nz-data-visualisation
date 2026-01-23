 
import { type Feature, type FeatureCollection } from "geojson";

    export interface Stats {
        count: number
        pct: number
    }

    export interface Demographics {
        area_name: string
        area_code: string
        mena: Stats
        other_ethnicity: Stats
        pasifika: Stats
        asian: Stats
        nz_european: Stats
        māori: Stats
        chinese: Stats
        indian: Stats
        filipino: Stats
        other_asian: Stats
        lgbt: Stats
        non_lgbt: Stats
        no_religion: Stats
        christian: Stats
        islam: Stats
        judaism: Stats
        total: number
    }

    type FlexibleProperties = {
        //id: string;
        demographics?: Demographics;
    } & Record<string, any>;

    export interface FeatureEthnicity extends Feature {
        properties: FlexibleProperties;
    }

    export interface FeatureCollectionEthnicity extends FeatureCollection {
        features: FeatureEthnicity[]
    }
    
    export interface SelectOption {
      value: keyof Demographics
      label: string
      cat: string
      suboption?: boolean
    
    }