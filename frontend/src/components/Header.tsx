
interface HeaderProps {
    onShowAbout: (view: boolean) => void;
}

export function Header({ onShowAbout }: HeaderProps) {
    
    return (
    <div className="flex flex-row bg-gray-600 text-gray-100 p-5">
        <div className="text-4xl font-bold font-[Segoe UI] italic text-gray-100 flex-2 self-end">
            <span className="ml-5">Census Visualiser Tool</span>
        </div>
        <div className="flex-5 flex flex-row text-xl italic ">
            <div className="px-7 self-end cursor-pointer hover:text-gray-300 hover:underline">Home</div>
            <div className="px-7 self-end cursor-pointer hover:text-gray-300 hover:underline" onClick={() => onShowAbout(true)}>About</div>
        </div>
    </div>
    )


}

