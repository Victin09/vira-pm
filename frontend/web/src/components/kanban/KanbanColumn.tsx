import { ColumnAttributes, TaskAttributes } from "@tidify/common"
import { useRef, useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { useMutation, useQueryClient } from "react-query"
import { createTask } from "../../api/column"
import { useMe } from "../../hooks/useMe"
import { KanbanTask } from "./KanbanTask"
import { Response } from "../../types";
import useOnClickOutside from "../../hooks/useClickOutside"

type KanbanColumnProps = {
  index: number,
  column: ColumnAttributes
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ index, column }) => {
  const createTaskRef = useRef<HTMLTextAreaElement>(null)
  const [newTask, setNewTask] = useState<boolean>(false)
  const { data: me, isLoading } = useMe();
  const queryClient = useQueryClient();
  const [newTaskName, setNewTaskName] = useState<string>('');

  const mutation = useMutation(createTask, {
    onMutate: (data: Omit<TaskAttributes, "id">) => {
      queryClient.cancelQueries("columns");

      const snapshot =
        queryClient.getQueryData<Response<ColumnAttributes[]>>("columns");

      // find columnd and update the tasks
      /**
       * {
                      id: Math.random(),
                      name: data.name,
                      description: "",
                      colId: column!.id,
                      userId: me.data.userId
                  }
       */
      snapshot &&
        queryClient.setQueryData<Response<ColumnAttributes[]>>(
          "columns",
          (prev) => ({
            data: [
              ...snapshot.data.map(c => {
                if (column!.id === c.id)
                  return {
                    ...c, tasks: [...c.tasks!, {

                      id: Math.random(),
                      name: data.name,
                      order: data.order,
                      priority: data.priority,
                      description: data.description,
                      colId: column!.id,
                      userId: me.data.userId
                    }]
                  }
                return c;
              })
            ],
            message: prev!.message,
            success: prev!.success,
          })
        );

      return { snapshot };
    },
    onError: (_, __, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData<Response<ColumnAttributes[]>>(
          "columns",
          context.snapshot
        );
      }
    },
    onSettled: () => queryClient.invalidateQueries("columns"),
  });

  const handleKeyPressed = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      setNewTask(false);
      mutation.mutate({
        colId: column.id,
        name: newTaskName,
        order: column.tasks?.length ?? 0,
        priority: "NORMAL",
        description: '',
        userId: me.id
      })
    }
  };

  const handleClickOutside = () => {
    setNewTask(false)
  }
  useOnClickOutside(createTaskRef, handleClickOutside)

  return (
    <Draggable draggableId={column.id.toString() + '-' + column.name} index={index} key={column.id}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="mr-3"
        >
          <div className="h-full" style={{ width: "16rem" }}>
            <div
              {...provided.dragHandleProps}
              className="px-2 py-2 flex sticky bg-base-200"
              style={{ zIndex: 50, width: "16rem", top: "0px" }}
            // style={{ width: "16rem" }}
            >
              <div className="flex items-center">
                <span className="truncate text-base">
                  {`${column.name} ${column.tasks && column.tasks.length} ${column.tasks && column.tasks.length === 1 ? "Tarea" : "Tareas"
                    }`.toUpperCase()}
                </span>
              </div>
            </div>
            {/* </div> */}
            <Droppable droppableId={column.id.toString()} type="task">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-2 ${snapshot.isDraggingOver ? "bg-base-300" : "bg-base-200"}`}
                  style={{ minHeight: "3em" }}
                >
                  {(column.tasks && column.tasks.length > 0) &&
                    column.tasks.map((task, taskIndex) => (
                      <KanbanTask task={task} index={taskIndex} key={task.name} />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="bg-base-200 mb-2">
              {!newTask ? (
                <div
                  className="flex flex-grow items-center justify-center pb-2"
                  onClick={() => setNewTask(true)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="font-bold">
                    <i className="bi bi-plus"></i> Añadir tarea
                  </span>
                </div>
              ) : (
                <textarea
                  ref={createTaskRef}
                  className="textarea mx-2 mb-2"
                  style={{ width: "93%" }}
                  placeholder="¿Qué se debe hacer?"
                  required
                  autoFocus
                  rows={3}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyPress={(e) => handleKeyPressed(e)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}