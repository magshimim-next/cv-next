export const SearchBox = ({
  placeHolder,
  value,
  onChange,
}: {
  placeHolder: string;
  value: string;
  onChange: (newValue: string) => void;
}) => {
  const isPlaceHolder = value === "";
  const searchColor = isPlaceHolder ? "text-gray-400" : "text-black";
  return (
    <input
      className={`border-gray-40 h-3/6 w-5/6 border-2 bg-white px-10 py-4 ${searchColor} rounded-md`}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      value={value}
      placeholder={placeHolder}
    />
  );
};
