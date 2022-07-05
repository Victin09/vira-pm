import { UseDisclosureProps, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import { BoardAttributes } from "@tidify/common";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { createBoard } from "../../api/board";
import { useSelectedGuild } from "../../store/useSelectedGuild";
import { Response } from "../../types";

const CreateBoardModal: React.FC = () => {
  const selectedGuild = useSelectedGuild(state => state.selectedGuild);
  const { register, handleSubmit, formState: { errors } } = useForm<{ title: string }>()
  const [loading, setLoading] = useState<boolean>(false)
  const queryClient = useQueryClient();

  const mutation = useMutation(createBoard, {
    onMutate: (data: Omit<BoardAttributes, "id">) => {
      queryClient.cancelQueries("boards");

      const snapshot =
        queryClient.getQueryData<Response<BoardAttributes[]>>("boards");

      snapshot &&
        queryClient.setQueryData<Response<BoardAttributes[]>>(
          "boards",
          (prev) => ({
            data: [
              ...snapshot.data,
              {
                id: Math.random(),
                ...data,
              },
            ],
            message: prev!.message,
            success: prev!.success,
          })
        );

      return { snapshot };
    },
    onError: (_, __, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData<Response<BoardAttributes[]>>(
          "events",
          context.snapshot
        );
      }
    },
    onSettled: () => queryClient.invalidateQueries("boards"),
    onSuccess: () => setLoading(false)
  });

  const onSubmit: SubmitHandler<{ title: string }> = (data) => {
    mutation.mutate({
      guildId: selectedGuild!.id,
      title: data.title,
    })
    setLoading(true)
  }

  return (
    // <>
    //   <Modal isOpen={isOpen!} onClose={onClose!} isCentered >
    //     <ModalOverlay />
    //     <ModalContent bg="var(--background-secondary)">
    //       <ModalHeader color="white">Create new Board</ModalHeader>
    //       <ModalCloseButton />
    //       <ModalBody
    //         paddingBottom="24px"
    //       >
    //         <Formik
    //           initialValues={{ title: '' }}
    //           onSubmit={(values, { setSubmitting }) => {
    //             setSubmitting(true);
    //             mutation.mutate({ title: values.title, guildId: selectedGuild!.id });

    //             onClose && onClose();
    //             setSubmitting(false);
    //           }}
    //         >
    //           {({ isSubmitting, errors, touched }) => (
    //             <Form>
    //               <FormInput
    //                 isInvalid={!!errors.title && touched.title}
    //                 name="title" type="text" placeholder="name"
    //                 errorMessage={errors.title}
    //                 label="Board name"
    //               />
    //               <Button
    //                 w="100%"
    //                 mt={4}
    //                 bg="var(--background-secondary-alt)"
    //                 isLoading={isSubmitting}
    //                 type="submit"
    //                 color="var(--text-primary)"
    //               >
    //                 Submit
    //               </Button>
    //             </Form>
    //           )}
    //         </Formik>
    //       </ModalBody>

    //     </ModalContent>
    //   </Modal>
    // </>
    <>
      <input type="checkbox" id="createBoardModal" className="modal-toggle" />
      <label htmlFor="createBoardModal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Congratulations random Internet user!</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Título</span>
              </label>
              <input className={`${errors.title ? 'input-error ' : ''}input input-bordered w-full`} placeholder="Evento uno" {...register('title', { required: true })} />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">El título es obligatorio</span>
                </label>
              )}
            </div>
            <button type="submit" className={`btn btn-primary w-full mt-1${loading ? ' loading' : ''}`}>Crear</button>
          </form>
        </label>
      </label>
    </>
  );
}

export default CreateBoardModal;