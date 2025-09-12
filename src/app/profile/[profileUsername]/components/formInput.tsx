import { UseFormRegister, Path } from "react-hook-form";
import { MdCancel } from "react-icons/md";
import { capitalizeWords } from "@/lib/utils";
import { FormErrorMessage, FormValues } from "./profileForm";

export const FormInput = ({
  field,
  placeholder,
  defaultValue,
  register,
  clearFunc,
  hasError,
  errorMsg,
  isRequired,
}: {
  field: Path<FormValues>;
  placeholder?: string;
  defaultValue?: string;
  register: UseFormRegister<FormValues>;
  clearFunc?: (field: Path<FormValues>) => void;
  hasError?: boolean;
  errorMsg?: string;
  isRequired?: boolean;
}) => {
  const label = capitalizeWords(field);

  return (
    <div className="flex flex-wrap justify-between">
      <label className="font-bold" htmlFor={field}>
        {label}:{" "}
      </label>

      <div className="relative w-full">
        <input
          className={`peer w-full rounded-md bg-accent p-1 hover:bg-muted ${clearFunc ? "pr-8" : ""}`}
          id={field}
          aria-invalid={!!hasError}
          {...(isRequired
            ? { ...register(field, { required: `${label} is required` }) }
            : { ...register(field) })}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
        {clearFunc && (
          <MdCancel
            size={20}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer peer-placeholder-shown:hidden"
            onClick={() => clearFunc(field)}
            role="button"
          />
        )}
      </div>

      {hasError && <FormErrorMessage message={errorMsg} />}
    </div>
  );
};
