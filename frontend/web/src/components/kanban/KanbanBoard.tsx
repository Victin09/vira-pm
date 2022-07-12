import React, { useState } from "react";
import {
	DragDropContext,
	Droppable,
	DropResult,
} from "react-beautiful-dnd";
import {
	BoardAttributes,
	ColumnAttributes,
} from "@tidify/common";
import { createColumn, updateColumns, updateTasks } from '../../api/board';
import { move, reorderColumns, reorderTaks } from "../../utils/dnd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getColumns } from "../../api/board";
import { Response } from "../../types";
import { SubmitHandler, useForm } from "react-hook-form";
import { KanbanColumn } from "./KanbanColumn";

interface BoardProps {
	board: BoardAttributes;
}

/*
* TODO: extract to components('column', 'task')
*/
const KanbanBoard: React.FC<BoardProps> = ({ board }) => {
	const { data, isLoading } = useQuery<Response<ColumnAttributes[]>>(
		"columns",
		() => getColumns(board.id)
	);
	// const { status, data, error } = useQuery(['todo', { id: 5 }], fetchTodoById)

	// const [selectedBoard, setBoard] = useState<BoardAttributes | null>(null);
	const [newList, setNewList] = useState<boolean>(false)
	const { register, handleSubmit, formState: { errors } } = useForm<{ title: string }>()

	const queryClient = useQueryClient();
	const updateColumnsMutation = useMutation(updateColumns, {
		onMutate: async () => {
			await queryClient.cancelQueries("columns");
		},
		onSuccess: data => {
			queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', data)
		},
		// onError: (_, __, context) => {
		// 	if (context?.snapshot) {
		// 		queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', context.snapshot);
		// 	}
		// },
		onSettled: () => queryClient.invalidateQueries("columns"),
	})

	const createColumnMutation = useMutation(createColumn, {
		onMutate: async (params: Omit<ColumnAttributes, "id" | "amount" | "order">) => {
			await queryClient.cancelQueries("columns");
		},
		// onError: (_, __, context) => {
		// 	if (context?.snapshot) {
		// 		queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', context.snapshot);
		// 	}
		// },
		onSettled: () => queryClient.invalidateQueries("columns"),
		onSuccess: data => {
			console.log('data', data)
			queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', data)
			setNewList(false)
		}
	})

	const updateTasksMutation = useMutation(updateTasks, {
		onMutate: async () => {
			await queryClient.cancelQueries("tasks");
		},
		// onError: (_, __, context) => {
		// 	if (context?.snapshot) {
		// 		queryClient.setQueryData<Response<TaskAttributes[]>>('tasks', context.snapshot);
		// 	}
		// },
		onSuccess: data => {
			queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', data)
		},
		onSettled: () => queryClient.invalidateQueries("tasks"),
	})

	if (isLoading) return null;

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
				console.log('reorderedTasks', tasks)
				updateTasksMutation.mutate({
					boardId: board.id,
					tasks
				})
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
					tasks: resultFromMove
				})
			}
		} else {
			const cols = reorderColumns(columns, source.index, destination.index);
			updateColumnsMutation.mutate({
				boardId: board.id,
				columns: cols
			})
		}
	};

	const onSubmit: SubmitHandler<{ title: string }> = ({ title }) => {
		createColumnMutation.mutate({
			boardId: board.id,
			name: title,
		})
	}

	return (
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
										className={`${errors.title ? 'input-error ' : ''}input input-bordered`}
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
											<span className="label-text-alt text-error">El nombre es obligatorio</span>
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

