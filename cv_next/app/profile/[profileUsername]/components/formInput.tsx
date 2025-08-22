import { UseFormRegister, Path } from "react-hook-form";
import { MdCancel } from "react-icons/md";
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
  return (
    <div className="flex flex-wrap justify-between">
      <label className="font-bold" htmlFor={field}>
        {capitalizeWords(field)}:{" "}
      </label>

      <div className="relative w-full">
        <input
          className={`peer w-full rounded-md bg-accent p-1 hover:bg-muted ${clearFunc ? "" : "pr-8"}"`}
          id={field}
          {...(isRequired
            ? { ...register(field, { required: `${placeholder} is required` }) }
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

/**
 * Capitalizes the first letter of each word in a sentence.
 * @param {string} sentence - The sentence to capitalize.
 * @returns {string} The capitalized sentence.
 */
function capitalizeWords(sentence: string) {
  return sentence
    .trim()
    .split(/[\s_]+/)
    .map((word) =>
      word.length === 0 ? "" : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}
