 
 import { DEMOGRAPHIC_LIST } from '../constants/DemographicOptions';
 import { type DemographicOptions, type DemographicValue, type DemographicLabel } from "../domain"

 export const getLabelFromValue = (value: DemographicValue): DemographicLabel| undefined => {
    return (DEMOGRAPHIC_LIST as DemographicOptions[])
        .find((row: DemographicOptions)=> row.value == value)
        ?.label;
 }

export const getValueFromLabel = (label: DemographicLabel): DemographicValue | undefined => {
    return (DEMOGRAPHIC_LIST as DemographicOptions[])
        .find((row: DemographicOptions)=> row.label == label)
        ?.value;
}