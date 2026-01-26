
import { pathGenerator } from '../services/geoMapUtils';
import { renderEthnicityColour } from '../services/pathUtils';
import { type MapLevel } from '../domain/Maps';
import { type SVGProps } from 'react';
import { type FeatureEthnicity } from '../domain/FeatureEthnicity';

const DEFAULT_ETHNICITY = "Asian";

export function Path(
    { region, mapLevel, ...props }
    : {region: FeatureEthnicity, mapLevel: MapLevel} & SVGProps<SVGPathElement>)  {

    return (
        <path 
            className="transition-[fill] duration-[1000ms] ease-in-out"
            cursor="pointer"
            strokeWidth="0"
            stroke="var(--color-gray-400)"
            data-level={mapLevel}
            data-demo={JSON.stringify(region.properties.demographics)}
            fill={renderEthnicityColour(region.properties.demographics, DEFAULT_ETHNICITY, mapLevel)}
            key={region.id}
            d={pathGenerator(region) ?? undefined}
            { ...props }           
        />
    )

}

