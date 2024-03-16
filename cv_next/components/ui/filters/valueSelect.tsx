import { useState } from "react"

export const DropdownInput = ({
    placeHolder,
    valueIds,
    valueId,
    onChange,
    getValueById,
    text
  }: {
    placeHolder: string,
    valueIds: number[],
    valueId: number | null,
    getValueById: (id: number) => string
    onChange: (newValue: number | null) => void,
    text: string
  }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isPlaceHolder = valueId === null

    const changeIsMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return <>
        <div className={`flex justify-center items-center relative w-1/6 h-2/6 whitespace-nowrap bg-white outline-gray-40 outline-2 ${isMenuOpen ? "outline-b-0 rounded-b-none" : ""} px-10 py-4 rounded-md cursor-pointer box-border`} onClick={changeIsMenuOpen} >
            <div className={`${isPlaceHolder ? 'text-gray-400' : 'text-black'}`}>
                {`${text}: ${isPlaceHolder ? placeHolder : getValueById(valueId)}`}
            </div>
            <div className={`absolute z-10 top-full w-full h-fit bg-white block ${isMenuOpen ? "block" : "hidden"} max-h-40 overflow-y-auto border-gray-40 border-2 border-t-0 divide-y-2`}>
                <div className="text-gray-400 w-full h-10 bg-white hover:bg-slate-200 flex justify-center items-center" onClick={() => onChange(null)}> 
                    {"all"}
                </div>
                {
                    valueIds.map((possibleValueId) => {
                        return <div className="text-black w-full h-8 bg-white hover:bg-slate-200 flex justify-center items-center" onClick={() => onChange(possibleValueId)}> 
                            {`${getValueById(possibleValueId)}`}
                        </div>
                    })
                }
            </div>
        </div>
    </>
  }
  