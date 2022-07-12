import * as yup from 'yup';

enum priorityEnum {
    HIGH,
    NORMAL,
    LOW
}

export const createTaskSchema = yup.object().shape({
    name: yup.string().required(),
    order: yup.number().required(),
    priority: yup.mixed<priorityEnum>().oneOf(Object.values(priorityEnum) as number[]),
    description: yup.string(),
});

export const updateTaskSchema = yup.object().shape({
    name: yup.string().required(),
    order: yup.number().required(),
    priority: yup.mixed<priorityEnum>().oneOf(Object.values(priorityEnum) as number[]),
    description: yup.string(),
});

