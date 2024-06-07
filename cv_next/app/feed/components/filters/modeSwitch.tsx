// TODO: talk with Yechiam about this entire file for the next version
export const ModeSwitch = ({
  values,
  value,
  onChange,
}: {
  value: string;
  values: [string, string];
  onChange: (newValue: string) => void;
}) => {
  const isRightSide = value === values[1];

  const onClick = () => {
    onChange(isRightSide ? values[0] : values[1]);
  };

  return (
    <>
      <div
        className={`border-gray-40 relative box-border flex h-3/6 w-1/6 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border-2 bg-white px-10 py-4`}
        onClick={onClick}
      >
        <div className="text-black">{value}</div>
        <div
          className={`absolute h-full w-5 rounded-md bg-black ${isRightSide ? "right-0" : `left-0`} transition-transform`}
        ></div>
      </div>
    </>
  );
};
