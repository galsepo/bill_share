import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginInterface, User } from "../../types/user";
import { fetchLogin } from "../../__api__/auth";
import { useUser } from "../../contexts/UserContext";
import { loginSchema } from "../../utils/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";

interface LoginFormProps {
  onLogin?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginInterface>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });
  const { setUser } = useUser();
  const { mutate, isLoading } = useMutation<
    User,
    ErrorRequest,
    LoginInterface,
    unknown
  >(fetchLogin, {
    onSuccess: (data) => {
      onLogin?.();
      setUser && setUser(data);
    },
    onError: (error) => {
      console.log(error);
      if (error.status === "401") {
        setUser(null);
      }
      // const message = getErrorMessage(error);
      // setFormError(message);
    },
  });
  const onSubmit: SubmitHandler<LoginInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    mutate(data);
  };

  return (
    <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="block">
        <Field
          label="Enter your email"
          error={errors.email}
          inputProps={{
            type: "email",
            autoComplete: "email",
            ...register("email"),
          }}
        />
        <Field
          label="Enter your password"
          inputProps={{
            type: "password",
            autoComplete: "current-password",
            ...register("password"),
          }}
        />
        <button
          type="submit"
          className={isLoading ? "button is-loading" : "button"}
          disabled={!isValid || !isDirty || isLoading}
        >
          Log in
        </button>
      </div>
    </form>
  );
};
