# Steps

## Getting Data

## Simplifying maps
After downloading data from https://datafinder.stats.govt.nz/ as KML, 
perform the follow on https://mapshaper.org/ for each map.

1. Select with advanced options
2. Drag the file
3. Submit
4. Click 'simplify' in the top right.
5. Click 'apply'
6. Simplify to 5% (exception, region which should be 2%)
7. Click 'repair' in the top left
8. Click 'console'
9. Type '-filter-islands min-area 15000'
10. Click 'export'
11. Select GeoJSON
12. Move into '/data-api/data/area_souce/'