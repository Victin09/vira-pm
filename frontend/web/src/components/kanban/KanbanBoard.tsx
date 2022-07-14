import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { BoardAttributes, ColumnAttributes } from "@tidify/common";
import { createColumn, updateColumns, updateTasks } from "../../api/board";
import { move, reorderColumns, reorderTaks } from "../../utils/dnd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getColumns } from "../../api/board";
import { Response } from "../../types";
import { SubmitHandler, useForm } from "react-hook-form";
import { KanbanColumn } from "./KanbanColumn";
import { Loader } from "../shared/Loader";

interface BoardProps {
  board: BoardAttributes;
}

const KanbanBoard: React.FC<BoardProps> = ({ board }) => {
  const { data } = useQuery<Response<ColumnAttributes[]>>(
    "columns",
    () => getColumns(board.id),
    {
      onSuccess: () => setLoading(false),
    }
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [newList, setNewList] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ title: string }>();

  const queryClient = useQueryClient();
  const updateColumnsMutation = useMutation(updateColumns, {
    onMutate: async () => {
      await queryClient.cancelQueries("columns");
      setLoading(true);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Response<ColumnAttributes[]>>("columns", data);
    },
    // onError: (_, __, context) => {
    // 	if (context?.snapshot) {
    // 		queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', context.snapshot);
    // 	}
    // },
    onSettled: () => queryClient.invalidateQueries("columns"),
  });

  const createColumnMutation = useMutation(createColumn, {
    onMutate: async (
      params: Omit<ColumnAttributes, "id" | "amount" | "order">
    ) => {
      await queryClient.cancelQueries("columns");
      setLoading(true);
    },
    // onError: (_, __, context) => {
    // 	if (context?.snapshot) {
    // 		queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', context.snapshot);
    // 	}
    // },
    onSettled: () => queryClient.invalidateQueries("columns"),
    onSuccess: (data) => {
      queryClient.setQueryData<Response<ColumnAttributes[]>>("columns", data);
      setNewList(false);
      setLoading(false);
    },
  });

  const updateTasksMutation = useMutation(updateTasks, {
    onMutate: async () => {
      await queryClient.cancelQueries("tasks");
      setLoading(true);
    },
    // onError: (_, __, context) => {
    // 	if (context?.snapshot) {
    // 		queryClient.setQueryData<Response<TaskAttributes[]>>('tasks', context.snapshot);
    // 	}
    // },
    onSuccess: (data) => {
      queryClient.setQueryData<Response<ColumnAttributes[]>>("columns", data);
    },
    onSettled: () => queryClient.invalidateQueries("tasks"),
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    let columns = data!.data;

    if (!destination) {
      return;
    }

    if (result.type === "task") {
      if (source.droppableId === destination.droppableId) {
        const col = columns.find(
          (el) => el.id.toString() === source.droppableId
        )!;
        const tasks = reorderTaks(col.tasks!, source.index, destination.index);
        console.log("reorderedTasks", tasks);
        updateTasksMutation.mutate({
          boardId: board.id,
          tasks,
        });
      } else {
        const sourceCol = columns.find(
          (el) => el.id.toString() === source.droppableId
        )!;
        const destCol = columns.find(
          (el) => el.id.toString() === destination.droppableId
        )!;
        const resultFromMove = move(
          sourceCol.tasks!,
          destCol.tasks!,
          source,
          destination
        );
        updateTasksMutation.mutate({
          boardId: board.id,
          tasks: resultFromMove,
        });
      }
    } else {
      const cols = reorderColumns(columns, source.index, destination.index);
      updateColumnsMutation.mutate({
        boardId: board.id,
        columns: cols,
      });
    }
  };

  const onSubmit: SubmitHandler<{ title: string }> = ({ title }) => {
    createColumnMutation.mutate({
      boardId: board.id,
      name: title,
    });
  };

  return (
    <div className="flex w-full h-full">
      {loading && <Loader />}
      <div className="flex flex-col w-full h-full">
        <h1 className="p-2 text-lg font-bold">{board.title}</h1>
        <div className="flex overflow-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="allCols"
              type="column"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex w-full p-2"
                >
                  {data?.data.map((list, index) => (
                    <KanbanColumn column={list} index={index} key={list.name} />
                  ))}
                  {provided.placeholder}
                  {!newList ? (
                    <div
                      className="flex align-center justify-center px-2 rounded bg-base-200 w-full sticky"
                      style={{
                        width: "16rem",
                        height: "4rem",
                        cursor: "pointer",
                        top: "0px",
                      }}
                      onClick={() => setNewList(true)}
                    >
                      <div
                        className="flex align-center"
                        style={{ width: "16em" }}
                      >
                        <i className="bi bi-plus"></i>
                        <span className="ms-2">Añadir nueva lista</span>
                      </div>
                    </div>
                  ) : (
                    <form
                      className="ml-2 p-2"
                      onSubmit={handleSubmit(onSubmit)}
                      style={{ width: "16rem" }}
                    >
                      <input
                        type="text"
                        autoFocus
                        className={`${
                          errors.title ? "input-error " : ""
                        }input input-bordered`}
                        placeholder="Añadir nueva columna"
                        {...register("title", {
                          required: {
                            value: true,
                            message: "El nombre es obligatorio",
                          },
                        })}
                      />
                      {errors.title && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            El nombre es obligatorio
                          </span>
                        </label>
                      )}
                    </form>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
