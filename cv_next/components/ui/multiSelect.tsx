import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useController,
  Validate,
  ValidationRule,
} from "react-hook-form";

interface MultiSelectProps<T extends FieldValues, V extends string | number = number> {
  name: Path<T>;
  label: string;
  options: V[];
  labels: string[];
  control: Control<T>;
  validation?: Partial<{
    required: string | ValidationRule<boolean>;
    min: ValidationRule<number>;
    max: ValidationRule<number>;
    maxLength: ValidationRule<number>;
    minLength: ValidationRule<number>;
    pattern: ValidationRule<RegExp>;
    validate: Validate<any, T> | Record<string, Validate<any, T>>;
  }>;
  selectLabel?: string;
  defaultValue?: PathValue<T, Path<T>>;
  customErrorStyle?: string;
}

/**
 * MultiSelect component allows users to select multiple options from a dropdown.
 */
export const MultiSelect = <T extends FieldValues, V extends string | number = number>({
  name,
  label,
  options,
  labels,
  control,
  validation,
  selectLabel,
  defaultValue,
  customErrorStyle,
}: MultiSelectProps<T, V>) => {
  if (options.length !== labels.length) {
    //eslint-disable-next-line
    console.error(
      "MultiSelect: options and labels should have the same length, \
            MultiSelect will not work properly"
    );
  }

  const { field, fieldState } = useController({
    control,
    name,
    rules: validation as Omit<typeof validation, "string">,
    defaultValue: defaultValue,
  });

  const handleChange = (value: V) => {
    field.onChange(
      field?.value
        ? !field?.value?.includes(value)
          ? [...field.value, value]
          : field.value.filter((item: any) => item !== value)
        : [value]
    );
  };

  const getLabelForValue = (value: V): string => {
    const idx = options.indexOf(value);
    return idx >= 0 ? labels[idx] : String(value);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <label className="font-bold" htmlFor={name}>
          {label}
        </label>
        <select
          value=""
          className="rounded-md bg-accent hover:bg-muted"
          onChange={(event) => {
            const raw = event.target.value;
            const parsed = (typeof options[0] === "number" ? Number(raw) : raw) as V;
            handleChange(parsed);
          }}
        >
          <option value="">{selectLabel ?? "Choose values"}</option>
          {options
            .filter((value) => !field?.value?.includes(value))
            .map((value, idx) => (
              <option key={String(value)} value={String(value)}>
                {labels[idx]}
              </option>
            ))}
        </select>
      </div>
      <div className="mt-1 max-h-16 w-full overflow-y-scroll rounded-md bg-accent p-1 hover:bg-muted">
        {field?.value?.length
          ? field?.value.map((value: V, idx: number) => (
              <a
                className="cursor-pointer"
                key={String(value)}
                onClick={() =>
                  field.onChange(
                    field?.value.filter((item: any) => item !== value)
                  )
                }
              >
                {getLabelForValue(value)}
                {idx < field?.value?.length - 1 && ","} &nbsp;
              </a>
            ))
          : "No values selected"}
      </div>
      {fieldState.error?.message && (
        <div className={customErrorStyle ?? "mb-2 text-red-500"}>
          {fieldState.error.message}
        </div>
      )}
    </div>
  );
};
