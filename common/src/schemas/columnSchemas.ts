import * as yup from 'yup';

export const createColumnSchema = yup.object().shape({
    name: yup.string().required()
});

export const updateColumnSchema = yup.object().shape({
    name: yup.string().required(),
    order: yup.number().required(),
    amount: yup.number(),
    tasks: yup.array(),
})
