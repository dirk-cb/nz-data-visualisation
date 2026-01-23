import { useState, useMemo } from 'react';
import Select, { components } from 'react-select';
import { type SelectOption } from "../domain/FeatureEthnicity"
import * as Popover from '@radix-ui/react-popover';
import { Settings } from 'lucide-react'


export const TabbedDemographicSelect = ({setValueSelected}: any) => {

  const [tab, setTab] = useState("All");


  const options: SelectOption[] = [
      { value: "asian", label: "Asian", cat: "Ethnicity"},
      { value: "chinese", label: "Chinese", cat: "Ethnicity", suboption: true},
      { value: "indian", label: "Indian", cat: "Ethnicity", suboption: true},
      { value: "filipino", label: "Filipino", cat: "Ethnicity", suboption: true},
      { value: "other_asian", label: "Other Asian", cat: "Ethnicity", suboption: true},
      { value: "nz_european", label: "European", cat: "Ethnicity"},
      { value: "mena", label: "MENA", cat: "Ethnicity"},
      { value: "māori", label: "Māori", cat: "Ethnicity"},
      { value: "pasifika", label: "Pasifika", cat: "Ethnicity"},
      { value: "other_ethnicity", label: "Other", cat: "Ethnicity"},
      { value: "no_religion", label: "No Religion", cat: "Religion"},
      { value: "christian", label: "Christian", cat: "Religion"},
      { value: "islam", label: "Islam", cat: "Religion"},
      { value: "judaism", label: "Judaism", cat: "Religion"},
      { value: "lgbt", label: "LGBT", cat: "Other"}
    
  ];

  const categoryTabs = useMemo(()=>["All", ...new Set(options.map((r: any) => r.cat))], []);

  
    


  const displayList = useMemo(()=>{

    if (tab == "All")
      return options
    else
      return options.filter((row: any)=>row.cat == tab)


  }, [tab])

  
  const CustomMenu = (props: any) => {
    return (
      <components.Menu {...props}>
        <div className=" flex text-center cursor-pointer sticky  bg-gray-500 gap-0"
            onTouchEnd={(e)=>e.stopPropagation()}
            
            >
            
          { 
            categoryTabs
              .map((cat: any)=>
              <div 
                key={cat} 
                className={`flex-1 bg-gray-300 hover:bg-gray-100 py-1.5 ${cat == tab ? "border-b-2 border-black" : ""}`} 
                onClick={()=>{
                  setTab(cat)}}>
                  {cat}
              </div>)
          }
        </div>
        {props.children}
      </components.Menu>
    );
  }

  const CustomOption = (props: any) => {
    return (
      
      <components.Option {...props} >
        
      <div className={props.data?.suboption == true ? "pl-5" : ""}>
        {props.children}
      </div>
      </components.Option>
   
    )
  }

  return (
    <div className="w-64">
      <label className="block text-md font-medium text-gray-100 mb-1">
        Demographic
      </label>

      <Select
      
        components={{ Menu:CustomMenu, Option:CustomOption }}
        isSearchable={true}
        className="text-sm hidden x md:block"
        options={ displayList }
        defaultValue={options[0]}
        closeMenuOnSelect={true} 
        blurInputOnSelect={false}
        onChange={(v: any)=>setValueSelected(v.label)}
      />
      <Select
      
        components={{ Menu:CustomMenu, Option:CustomOption }}
        isSearchable={false}
        className="text-sm md:hidden x block"
        options={ displayList }
        defaultValue={options[0]}
        closeMenuOnSelect={true} 
        blurInputOnSelect={false}
        onChange={(v: any)=>setValueSelected(v.label)}
      />
    </div>
  );
};


;

export const ToggleZoom = ({ zoomSetting, setZoomSetting } : any) => {

  const options = ["Default", "Regions", "Territorial", "SA3", "SA2"]

  const [open, setOpen] = useState(false );


  return (<Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="p-2">
            <Settings color="white"/>
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <div 
          className="bg-gray-200 border-1  text-black shadow-sm/50" 
          >
            <div className="bg-gray-300 p-2  font-medium">Map Settings</div>
            <div className="p-2">
               <select value={zoomSetting} className="bg-white" onChange={(r)=>{setZoomSetting(r.target.value); setOpen(false)}}>
              
              {options.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}

            </select>
            </div>
            
        </div>
      </Popover.Content>
  </Popover.Root>)


}