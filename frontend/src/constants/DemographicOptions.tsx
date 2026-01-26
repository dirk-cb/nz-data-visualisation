import {  type DemographicOptions } from "../domain/FeatureEthnicity"

export const DEMOGRAPHIC_LIST: DemographicOptions[] = [
    { value: "asian", label: "Asian", cat: "Ethnicity", suboption: false },
    { value: "chinese", label: "Chinese", cat: "Ethnicity", suboption: true },
    { value: "indian", label: "Indian", cat: "Ethnicity", suboption: true },
    { value: "filipino", label: "Filipino", cat: "Ethnicity", suboption: true },
    { value: "other_asian", label: "Other Asian", cat: "Ethnicity", suboption: true },
    { value: "nz_european", label: "European", cat: "Ethnicity", suboption: false },
    { value: "mena", label: "MENA", cat: "Ethnicity", suboption: false },
    { value: "māori", label: "Māori", cat: "Ethnicity", suboption: false },
    { value: "pasifika", label: "Pasifika", cat: "Ethnicity", suboption: false },
    { value: "other_ethnicity", label: "Other", cat: "Ethnicity", suboption: false },
    { value: "no_religion", label: "No Religion", cat: "Religion", suboption: false },
    { value: "christian", label: "Christian", cat: "Religion", suboption: false },
    { value: "islam", label: "Islam", cat: "Religion", suboption: false },
    { value: "judaism", label: "Judaism", cat: "Religion", suboption: false },
    { value: "lgbt", label: "LGBT", cat: "Other", suboption: false }
];


