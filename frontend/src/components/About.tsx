

interface HeaderProps {
    onShowAbout: (view: boolean) => void;
}

export function About({ onShowAbout }: HeaderProps) {

    return (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-1">
          <div className="bg-gray-200 rounded-md flex flex-col w-2xl">
            <div className="bg-gray-600 text-right pr-2">
                <span className="font-bold cursor-pointer" onClick={()=>onShowAbout(false)}>❌</span>
            </div>
            <div className="p-3 justify-center">
                Census Visualiser Tool visualises demographic data from the{" "}
                <a href="https://www.stats.govt.nz/2023-census" target="_blank" className="text-blue-600" >NZ 2023 Census</a> by{" "}
                statistical areas. Demographic from the {" "}
                <a href="https://www.stats.govt.nz/tools/aotearoa-data-explorer/ade-api-user-guide/" target="_blank" className="text-blue-600" >Aotearoa Data Explorer</a>{" "}
                and maps downloaded from <a href="https://datafinder.stats.govt.nz/" target="_blank" className="text-blue-600">Stats NZ Geographic Data Service</a>.

                <p className="text-red-600 mt-2">Note: This tool is in early development. </p>
            </div>

          </div>
        </div>
    )

}

