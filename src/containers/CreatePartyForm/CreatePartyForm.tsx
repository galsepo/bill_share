import { FC } from "react";
import { createParty } from "../../__api__/parties";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreatePartyInterface, PartyInterface } from "../../types/party";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Field } from "../../components";
import { useUser } from "../../contexts/UserContext";
import { createPartySchema } from "../../utils/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";

interface CreatePartyFormProps {}

export const CreatePartyForm: FC<CreatePartyFormProps> = (props) => {
  const { user, setUser } = useUser();
  const { id } = user || {};
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<CreatePartyInterface>({
    defaultValues: {
      // userName: name,
      id,
    },
    resolver: yupResolver(createPartySchema),
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation<
    PartyInterface,
    Response,
    CreatePartyInterface,
    unknown
  >(createParty, {
    onSuccess: (data) => {
      navigate(`/party/${data?.id}`);
    },
    onError: async (error) => {
      if (error.status === 401) {
        setUser(null);
      }
      if (error) {
        const body: ErrorRequest = await error.json();
        if (body.validation) {
          Object.keys(body.validation).forEach((key: string) => {
            setError(key as keyof CreatePartyInterface, {
              type: "value",
              message: body?.validation?.[key],
            });
          });
        }
      }

      // const message = getErrorMessage(error);
      // setFormError(message);
    },
  });

  const onSubmit: SubmitHandler<CreatePartyInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    mutate(data);
  };

  return (
    <form
      id="start-new-party"
      className="mt-5"
      action=""
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="block">
        <h2 className="title is-3 my-2">Create your party</h2>
        {/* Field for /party/temporary creation */}
        {/* <Field
          label="Enter your name"
          error={errors.userName}
          inputProps={{ type: "text", ...register("userName") }}
        /> */}
        <Field
          label="Enter your party name"
          error={errors.partyName}
          inputProps={{ type: "text", ...register("partyName") }}
        />
        <button
          type="submit"
          className={isLoading ? "button is-loading" : "button"}
          disabled={!isValid || !isDirty || isLoading}
        >
          Start party
        </button>
      </div>
    </form>
  );
};
