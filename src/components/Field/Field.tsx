import React, { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

const getBulmaInputClassName = (
  type: React.InputHTMLAttributes<HTMLInputElement>["type"]
) => {
  switch (type) {
    case "text":
    case "password":
    case "email":
    case "number":
    case undefined:
      return "input";
    default:
      return type;
  }
};

const getBulmaLabelClassName = (
  type: React.InputHTMLAttributes<HTMLInputElement>["type"]
) => {
  switch (type) {
    case "text":
    case "number":
    case "password":
    case "email":
    case undefined:
      return "label";
    default:
      return type;
  }
};

export const Field: FC<{
  label?: string;
  labels?: string[];
  error?: FieldError;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> &
    Partial<UseFormRegisterReturn>;
}> = ({ label, labels, inputProps, error }) => {
  const { type } = inputProps;
  const classNameInput = getBulmaInputClassName(type);
  const classNameLabel = getBulmaLabelClassName(type);

  if (type === "radio" && Array.isArray(inputProps.value)) {
    return (
      <div className="field">
        <div className="control">
          {inputProps.value.map((value, i) => (
            <React.Fragment key={value}>
              {labels && (
                <label className={`${classNameLabel} mr-2`}>
                  <input {...inputProps} value={value} />
                  {labels?.[i]}
                </label>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="field">
      {label && type !== "checkbox" && (
        <label htmlFor={inputProps.name} className={classNameLabel}>
          {label}
        </label>
      )}
      <div className="control">
        {(!label || type !== "checkbox") && (
          <input
            className={`${classNameInput}${error ? " is-danger" : ""}`}
            {...inputProps}
          />
        )}
        {label && type === "checkbox" && (
          <label className={classNameLabel}>
            <input
              className={`${classNameInput}${error ? " is-danger" : ""}`}
              {...inputProps}
            />
            {label}
          </label>
        )}
      </div>
      {error?.message && <p className="help is-danger">{error?.message}</p>}
    </div>
  );
};
