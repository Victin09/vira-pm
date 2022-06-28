import { GuildAttributes } from '@tidify/common';
import { Form, Formik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { createGuild } from '../../api/guild';
import { useMe } from '../../hooks/useMe';
import { Response } from '../../types';
import FormInput from '../auth/FormInput';
import Button from '../shared/Button';

type ModalProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

const ModalContainer = styled.div<{ show: boolean }>`
  height: 100vh;
  width: 100vw;
  background: rgb(0, 0, 0, 0.3);
  display: ${({ show }) => show ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* position: fixed; */
`;

const ModalBox = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: 400px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  border-radius: 10px;
`;


const ModalContent = styled(motion.div)`
  padding: 5px;
`;

const ToggleBtn = styled(motion.button)`
  cursor: pointer;
  font-size: 20px;
  color: #fff;
  padding: 0.5rem 0.8rem;
  margin-top: 3rem;
  background: #3bb75e;
  text-decoration: none;
  border: none;
  border-radius: 50px;
`;

const CreateGuildModal = ({ showModal, setShowModal }: ModalProps) => {
  const { data, isLoading } = useMe();
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

  return (
    <ModalContainer show={showModal}>
      <AnimatePresence>
        {showModal && (
          <ModalBox
            initial={{
              opacity: 0,
              y: 60, scale: 0.5
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              // making use of framer-motion spring animation
              // with stiffness = 300
              transition: {
                type: "spring",
                stiffness: 300
              }
            }}
            exit={{
              opacity: 0, scale: 0.5,
              transition: { duration: 0.6 }
            }}>
            <ModalContent
              initial={{ y: -30, opacity: 0 }}
              animate={{
                y: 0, opacity: 1,
                transition: { delay: 0.5 }
              }}>
              <Formik
                initialValues={{ name: '' }}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  mutation.mutate(values.name);

                  setShowModal(false)
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <FormInput
                      isInvalid={!!errors.name && touched.name}
                      name="name" type="text" placeholder="Nombre del proyecto"
                      errorMessage={errors.name}
                      label="Name"
                    />
                    <Button type='submit'>
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </ModalContent>
          </ModalBox>
        )}
      </AnimatePresence>
    </ModalContainer>
  )
}

export default CreateGuildModal;