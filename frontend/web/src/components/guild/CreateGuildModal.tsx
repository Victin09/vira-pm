import { GuildAttributes } from '@tidify/common';
import { Field, Form, Formik } from 'formik';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { createGuild } from '../../api/guild';
import { useMe } from '../../hooks/useMe';
import { Response } from '../../types';

type ModalProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

const CreateGuildModal = ({ showModal, setShowModal }: ModalProps) => {
  const { data, isLoading } = useMe();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ name: string }>();
  const queryClient = useQueryClient();
  const mutation = useMutation(createGuild, {
    onMutate: async (name: string) => {
      await queryClient.cancelQueries("guilds");

      const snapshot = queryClient.getQueryData<Response<GuildAttributes[]>>("guilds");

      snapshot && queryClient.setQueryData<Response<GuildAttributes[]>>("guilds", prev => ({
        data: [
          ...snapshot.data,
          { name, id: Math.random(), ownerId: data.data.userId },
        ],
        message: prev!.message,
        success: prev!.success
      }));

      return { snapshot };
    },
    onError: (_, __, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData<Response<GuildAttributes[]>>('guilds', context.snapshot);
      }
    },
    onSettled: () => queryClient.invalidateQueries("guilds"),
  })

  const onSubmit: SubmitHandler<{ name: string }> = (data) => {
    console.log(data.name);
    mutation.mutate(data.name)
  }

  return (
    <>
      <input type="checkbox" id="createGuildModal" className="modal-toggle" />
      <label htmlFor="createGuildModal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Crear un nuevo proyecto</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nombre del proyecto</span>
              </label>
              <input type="text" placeholder="Proyecto uno" className={`${errors.name ? 'input-error ' : ''}input input-bordered w-full`}
                {...register("name", { required: true })} />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">El nombre es obligatorio</span>
                </label>
              )}
            </div>
            <button className='btn btn-primary w-full mt-2'>Enviar</button>
          </form>
          <p className="py-4"></p>
        </label>
      </label>
    </>
  )
}

export default CreateGuildModal;