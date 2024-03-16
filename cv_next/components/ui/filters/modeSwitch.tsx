
export const ModeSwitch = ({
    values,
    value,
    onChange,
  }: {
    value: string,
    values: [string, string],
    onChange: (newValue: string) => void,
  }) => {
    const isRightSide = value === values[1]

    const onClick = () => {
        onChange(isRightSide ? values[0] : values[1])
    }

    return <>
        <div className={`flex justify-center items-center relative w-1/6 h-3/6 whitespace-nowrap bg-white border-gray-40 border-2 px-10 py-4 rounded-md cursor-pointer box-border`} onClick={onClick}>
            <div className='text-black'>
                {value}
            </div>
            <div className={`absolute h-full w-5 bg-black rounded-md ${isRightSide ? "right-0" : `left-0`} transition-transform`}></div>
        </div>
    </>
  }
  