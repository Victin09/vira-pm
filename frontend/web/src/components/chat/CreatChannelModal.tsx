import { ChannelAttributes } from "@tidify/common";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { createChannel } from "../../api/channel";
import { useSelectedGuild } from "../../store/useSelectedGuild";

const CreateChannelModal = () => {
  const { selectedGuild } = useSelectedGuild();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();
  const queryClient = useQueryClient();
  const mutation = useMutation(createChannel, {
    onMutate: async (data: Omit<ChannelAttributes, "id">) => {
      await queryClient.cancelQueries("channel");
    },
    onSettled: () => queryClient.invalidateQueries("channel"),
  });

  const onSubmit: SubmitHandler<{ name: string }> = (data) => {
    console.log(data.name);
    mutation.mutate({
      name: data.name,
      guildId: selectedGuild!.id,
    });
  };

  return (
    <>
      <input type="checkbox" id="createChannelModal" className="modal-toggle" />
      <label htmlFor="createChannelModal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Crear un nuevo canal</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nombre del canal</span>
              </label>
              <input
                type="text"
                placeholder="Canal uno"
                className={`${
                  errors.name ? "input-error " : ""
                }input input-bordered w-full`}
                {...register("name", { required: true })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    El nombre es obligatorio
                  </span>
                </label>
              )}
            </div>
            <button className="btn btn-primary w-full mt-2">Enviar</button>
          </form>
        </label>
      </label>
    </>
  );
};

export default CreateChannelModal;
