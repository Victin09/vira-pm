import { ColumnAttributes, TaskAttributes as Task } from '@tidify/common'
import {
    DraggableLocation,
} from 'react-beautiful-dnd';

export const reorderTaks = (list: Task[], startIndex: number, endIndex: number): Task[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const reorderColumns = (lists: ColumnAttributes[], startIndex: number, endIndex: number): ColumnAttributes[] => {
    const result = [...lists];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.map((item, index) => (item.order = index));

    return result;
};

export const move = (source: Task[], destination: Task[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
    const sourceClone = [...source];
    const destClone = [...destination];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {} as { [key: string]: Task[] };
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
