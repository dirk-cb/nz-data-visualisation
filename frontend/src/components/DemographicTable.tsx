import { type Demographics } from "../domain"
import { DEMOGRAPHIC_LIST } from '../constants/DemographicOptions';
import { useMemo } from "react";

export const DemographicTable = ({demographic}: {demographic: Demographics | null | undefined}) => {


    const ethnicities = useMemo(()=>{
    
            if (!demographic)
                return [];
    
            return DEMOGRAPHIC_LIST
                .filter((row)=>row.cat === "Ethnicity" && !row.suboption)
                .sort((x,y)=>demographic[y.value].pct - demographic[x.value].pct)
                .map((x)=>{
                    return {"name":x.label, "demo":demographic[x.value]}
                });
    
        }, [demographic]);
    
        const religions = useMemo(()=>{
    
            if (!demographic)
                return [];
    
            return DEMOGRAPHIC_LIST
                .filter((row)=>row.cat === "Religion" && !row.suboption)
                .sort((x,y)=>demographic[y.value].pct - demographic[x.value].pct)
                .map((x)=>{
                    return {"name":x.label, "demo":demographic[x.value]}
                });
    
        }, [demographic]);



        if (!demographic)
            return (<></>);
        

    return (<div className="select-text ">
                    <div className="my-1" >
                        <span className="font-bold text-lg text-gray-600">Population </span> { (demographic.total).toLocaleString() }
                    </div>
                    <div className="my-1">
                        <span className="font-bold text-lg text-gray-600">LGBT </span> { (demographic.lgbt.pct * 100).toFixed(2) }%
                    </div>
                    <table className="lg:table-fixed table-auto w-full mb-5">
                        <thead className="sticky top-0">
                        <tr className="bg-gray-500 text-gray-100 ">
                            <th className="p-0.5">Ethnicity</th>
                            <th className="p-0.5">%</th>
                            <th className="p-0.5">Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ethnicities.map((row, i)=>{
                        return  (<tr className="odd:bg-white even:bg-gray-200" key={i}>
                            <td className="p-0.5 pl-2 border-r-2 border-gray-400 ">{row.name}</td>
                            <td className="p-0.5 pl-2 border-r-2 border-gray-400 text-right pr-2">{(row.demo.pct * 100).toFixed(2)}%</td>
                            <td className="p-0.5 pl-2 text-right pr-2">{row.demo.count.toLocaleString()}</td>
                        </tr>)
                        })}
                        </tbody>
                    </table>
                    <table className="lg:table-fixed table-auto w-full ">
                        <thead className="sticky top-0">
                        <tr className="bg-gray-500 text-gray-100 ">
                            <th className="p-0.5">Religion</th>
                            <th className="p-0.5">%</th>
                            <th className="p-0.5">Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        {religions.map((row, i)=>{
                        return  (<tr className="odd:bg-white even:bg-gray-200" key={i}>
                            <td className="p-0.5 pl-2 border-r-2 border-gray-400 ">{row.name}</td>
                            <td className="p-0.5 pl-2 border-r-2 border-gray-400 text-right pr-2">{(row.demo.pct * 100).toFixed(2)}%</td>
                            <td className="p-0.5 pl-2 text-right pr-2">{row.demo.count.toLocaleString()}</td>
                        </tr>)
                        })}
                        </tbody>
                    </table>
                 </div>)
}