export const SearchBox = ({
  placeHolder,
  value,
  onChange,
}: {
  placeHolder: string,
  value: string
  onChange: (newValue: string) => void
}) => {
  const isPlaceHolder = value === ""
  return (
    <input 
      className={`w-5/6 h-3/6 bg-white border-gray-40 border-2 px-10 py-4 ${isPlaceHolder ? 'text-gray-400' : 'text-black'} rounded-md`} 
      onChange={(event) => {onChange(event.target.value)}} value={value}
      placeholder={placeHolder}/>
  )
}
