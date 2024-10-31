import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useController,
  Validate,
  ValidationRule,
} from "react-hook-form";

interface MultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: number[];
  labels: string[];
  control: Control<T>;
  validation: Partial<{
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
 * Multi-Select input component, using react-hook-form.
 *
 * Note: labels should match options in length and order
 */
export const MultiSelect = <T extends FieldValues>({
  name,
  label,
  options,
  labels,
  control,
  validation,
  selectLabel,
  defaultValue,
  customErrorStyle,
}: MultiSelectProps<T>) => {
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

  const handleChange = (value: number) => {
    field.onChange(
      field?.value
        ? !field?.value?.includes(value)
          ? [...field.value, value]
          : field.value.filter((item: any) => item !== value)
        : [value]
    );
  };

  return (
    <>
      <div className="flex justify-between">
        <label htmlFor={name}>{label}</label>
        <select
          value=""
          onChange={(event) => handleChange(parseInt(event.target.value))}
        >
          <option value="">{selectLabel ?? "Choose values"}</option>
          {options
            .filter((value) => !field?.value?.includes(value))
            .map((value) => (
              <option key={value} value={value}>
                {labels[value]}
              </option>
            ))}
        </select>
      </div>
      <div className="w-100 bg-theme-700">
        {field?.value?.length
          ? field?.value.map((value: any, idx: number) => (
              <a
                className="cursor-pointer"
                key={value}
                onClick={() =>
                  field.onChange(
                    field?.value.filter((item: any) => item !== value)
                  )
                }
              >
                {labels[value]}
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
    </>
  );
};
