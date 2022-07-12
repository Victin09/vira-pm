import React, { useEffect, useState } from "react";
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

/*
 * TODO: extract to components('column', 'task')
 */
const KanbanBoard: React.FC<BoardProps> = ({ board }) => {
  const { data } = useQuery<Response<ColumnAttributes[]>>(
    "columns",
    () => getColumns(board.id),
    {
      // onSuccess: () => setLoading(false),
    }
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("isLoading", loading);
  }, [loading]);

  // const { status, data, error } = useQuery(['todo', { id: 5 }], fetchTodoById)

  // const [selectedBoard, setBoard] = useState<BoardAttributes | null>(null);
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
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Response<ColumnAttributes[]>>("columns", data);
      setLoading(false);
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

  /*
   * TODO: Change rest calls with react queries
   */
  // const onDragEnd = async (result: any) => {
  //   const { destination, source } = result;

  //   if (!destination) return;

  //   if (result.type === "task") {
  //     const sourceList = lists.find((list) => list._id === source.droppableId);
  //     const destinationList = lists.find(
  //       (list) => list._id === destination.droppableId
  //     );

  //     if (sourceList && destinationList) {
  //       if (sourceList._id === destinationList._id) {
  //         const newCards = reorder(
  //           sourceList.cards!,
  //           source.index,
  //           destination.index
  //         );

  //         await Promise.all(
  //           newCards.map(async (card) => {
  //             try {
  //               const apiResponse = await fetch(
  //                 `${getApiUrl()}/kanban/cards/${card._id}`,
  //                 {
  //                   method: "PUT",
  //                   headers: {
  //                     "Content-Type": "application/json",
  //                   },
  //                   body: JSON.stringify(card),
  //                 }
  //               );
  //               const result: ApiResponse<any> = await apiResponse.json();
  //               if (result.status !== 200) return;
  //             } catch (error) {
  //               console.log("error", error);
  //             }
  //           })
  //         );
  //         const newState = lists.map((list) => {
  //           list._id === sourceList._id && (list.cards = newCards);
  //           return list;
  //         });
  //         setLists(newState);
  //       } else {
  //         // Remove from list and reorder cards
  //         const { removed, result } = removeAndReorder(
  //           sourceList.cards!,
  //           source.index,
  //           destination.index
  //         );
  //         // Update new source list cards order
  //         await Promise.all(
  //           result.map(async (card) => {
  //             try {
  //               const apiResponse = await fetch(
  //                 `${getApiUrl()}/kanban/cards/${card._id}`,
  //                 {
  //                   method: "PUT",
  //                   headers: {
  //                     "Content-Type": "application/json",
  //                   },
  //                   body: JSON.stringify(card),
  //                 }
  //               );
  //               const result: ApiResponse<any> = await apiResponse.json();
  //               if (result.status !== 200) return;
  //             } catch (error) {
  //               console.log("error", error);
  //             }
  //           })
  //         );

  //         // Update card new list
  //         removed.list = destinationList._id;
  //         // Insert into new list
  //         const newCards = insertAndReorder(
  //           destinationList!.cards,
  //           removed,
  //           destination.index
  //         );
  //         // Update new cards order
  //         await Promise.all(
  //           newCards.map(async (card) => {
  //             try {
  //               const apiResponse = await fetch(
  //                 `${getApiUrl()}/kanban/cards/${card._id}`,
  //                 {
  //                   method: "PUT",
  //                   headers: {
  //                     "Content-Type": "application/json",
  //                   },
  //                   body: JSON.stringify(card),
  //                 }
  //               );
  //               const result: ApiResponse<any> = await apiResponse.json();
  //               if (result.status !== 200) return;
  //             } catch (error) {
  //               console.log("error", error);
  //             }
  //           })
  //         );
  //         const newState = lists.map((list) => {
  //           list._id === sourceList._id && (list.cards = result);
  //           list._id === destinationList._id && (list.cards = newCards);
  //           return list;
  //         });
  //         setLists(newState);
  //       }
  //     }
  //   } else {
  //     const listsTmp = [...lists];
  //     const reorderedList = reorder(listsTmp, source.index, destination.index);
  //     await Promise.all(
  //       reorderedList.map(async (list) => {
  //         try {
  //           const apiResponse = await fetch(
  //             `${getApiUrl()}/kanban/lists/${list._id}`,
  //             {
  //               method: "PUT",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify(list),
  //             }
  //           );
  //           const result: ApiResponse<any> = await apiResponse.json();
  //           if (result.status !== 200) return;
  //         } catch (error) {
  //           console.log("error", error);
  //         }
  //       })
  //     );
  //     setLists(reorderedList);
  //   }
  // };

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
    <div className="flex overflow-auto">
      {loading && (
        <div className="flex items-center justify-center w-full h-full fixed bg-base-100 bg-opacity-20">
          <svg
            role="status"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            ></path>
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            ></path>
          </svg>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="allCols" type="column" direction="horizontal">
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
                  <div className="flex align-center" style={{ width: "16em" }}>
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
  );
};

export default KanbanBoard;
