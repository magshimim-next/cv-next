export const InputBox = ({
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
      className={`border-gray-40 h-3/6 w-full border-2 bg-white px-10 py-4 text-center md:text-left ${searchColor} rounded-md`}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      value={value}
      placeholder={placeHolder}
    />
  );
};

export const InputTextArea = ({
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
    <textarea
      name="textArea"
      rows={2}
      className={`border-gray-40 h-3/6 w-full border-2 bg-white px-10 py-4 text-center md:text-left ${searchColor} max-h-40 rounded-md`}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      value={value}
      placeholder={placeHolder}
    />
  );
};
