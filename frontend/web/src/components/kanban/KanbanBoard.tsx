import React, { useState } from "react";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DroppableProvided,
	DropResult,
	DroppableStateSnapshot,
	DraggableProvided,
	DraggableStateSnapshot,
} from "react-beautiful-dnd";
import {
	BoardAttributes,
	ColumnAttributes,
	TaskAttributes,
} from "@tidify/common";
import { createColumn, updateColumns } from '../../api/board';
import { move, reorderColumns, reorderTaks } from "../../utils/dnd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getColumns } from "../../api/board";
import { Response } from "../../types";
import { SubmitHandler, useForm } from "react-hook-form";

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

	// const [selectedBoard, setBoard] = useState<BoardAttributes | null>(null);
	const [newList, setNewList] = useState<boolean>(false)
	const [newTask, setNewTask] = useState<boolean>(false)
	const { register, handleSubmit, formState: { errors } } = useForm<{ title: string }>()

	const queryClient = useQueryClient();
	const updateColumnsMutation = useMutation(updateColumns, {
		onMutate: async () => {
			await queryClient.cancelQueries("columns");

			const snapshot = queryClient.getQueryData<Response<ColumnAttributes[]>>("columns");

			snapshot && queryClient.setQueryData<Response<ColumnAttributes[]>>(
				"columns",
				(prev) => ({
					data: prev!.data.map((item) => {
						return item;
					}),
					message: prev!.message,
					success: prev!.success,
				})
			);

			// snapshot && queryClient.setQueryData<Response<ColumnAttributes[]>>("columns", prev => ({
			// 	data: [
			// 		...snapshot.data,
			// 		{
			// 			name: params.name,
			// 			id: Math.random(),
			// 			boardId: params.boardId,
			// 			amount: 0,
			// 			order: 0,
			// 		},
			// 	],
			// 	message: prev!.message,
			// 	success: prev!.success
			// }));

			return { snapshot };
		},
		onError: (_, __, context) => {
			if (context?.snapshot) {
				queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', context.snapshot);
			}
		},
		onSettled: () => queryClient.invalidateQueries("columns"),
	})

	const createColumnMutation = useMutation(createColumn, {
		onMutate: async (params: Omit<ColumnAttributes, "id" | "amount" | "order">) => {
			await queryClient.cancelQueries("columns");

			const snapshot = queryClient.getQueryData<Response<ColumnAttributes[]>>("columns");

			snapshot && queryClient.setQueryData<Response<ColumnAttributes[]>>("columns", prev => ({
				data: [
					...snapshot.data,
					{
						name: params.name,
						id: Math.random(),
						boardId: params.boardId,
						amount: 0,
						order: 0,
					},
				],
				message: prev!.message,
				success: prev!.success
			}));

			return { snapshot };
		},
		onError: (_, __, context) => {
			if (context?.snapshot) {
				queryClient.setQueryData<Response<ColumnAttributes[]>>('columns', context.snapshot);
			}
		},
		onSettled: () => queryClient.invalidateQueries("columns"),
		onSuccess: () => setNewList(false)
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
				queryClient.setQueryData<Response<ColumnAttributes[]>>(
					"columns",
					(prev) => ({
						data: prev!.data.map((item) =>
							item.id.toString() === source.droppableId ? { ...col, tasks } : item
						),
						message: prev!.message,
						success: prev!.success,
					})
				);
				//setColumns(prev => prev.map(item => item.id.toString() === source.droppableId ? { ...col, tasks } : item))
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

				queryClient.setQueryData<Response<ColumnAttributes[]>>(
					"columns",
					(prev) => ({
						data: prev!.data.map((item) => {
							if (item.id.toString() === source.droppableId) {
								return {
									...sourceCol,
									tasks: resultFromMove[source.droppableId],
								};
							} else if (item.id.toString() === destination.droppableId) {
								return {
									...destCol,
									tasks: resultFromMove[destination.droppableId],
								};
							}
							return item;
						}),
						message: prev!.message,
						success: prev!.success,
					})
				);

				/*setColumns(prev => {
									return prev.map(item => {
											if (item.id.toString() === source.droppableId) {
													return { ...sourceCol, tasks: resultFromMove[source.droppableId] }
											} else if (item.id.toString() === destination.droppableId) {
													return { ...destCol, tasks: resultFromMove[destination.droppableId] }
											}
											return item;
									})
							})*/
			}
		} else {
			const cols = reorderColumns(columns, source.index, destination.index);
			console.log('cols', cols)
			updateColumnsMutation.mutate({
				boardId: board.id,
				columns: cols
			})
			// queryClient.setQueryData<Response<ColumnAttributes[]>>(
			// 	"columns",
			// 	(prev) => ({
			// 		data: prev!.data.map((item) => {
			// 			const equalCol = cols.find((col) => {
			// 				return col.id === item.id;
			// 			});
			// 			if (equalCol) {
			// 				return {
			// 					...equalCol,
			// 					order: equalCol.order
			// 				}
			// 			}
			// 			return item;
			// 		}).sort((a, b) => {
			// 			return a.order - b.order;
			// 		}),
			// 		message: prev!.message,
			// 		success: prev!.success,
			// 	})
			// );
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
		}
	};

	const onSubmit: SubmitHandler<{ title: string }> = ({ title }) => {
		createColumnMutation.mutate({
			boardId: board.id,
			name: title,
		})
	}

	return (
		<div className="flex m-1">
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
							className="flex w-full"
						>
							{data?.data.map((list, index) => (
								// return <List key={index} data={list} />;
								<Draggable draggableId={list.id.toString()} index={index}>
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
															{`${list.name} ${list.tasks && list.tasks.length} ${list.tasks && list.tasks.length > 1 ? "Tareas" : "Tarea"
																}`.toUpperCase()}
														</span>
													</div>
												</div>
												{/* </div> */}
												<Droppable droppableId={list.id.toString()} type="task">
													{(provided, snapshot) => (
														<div
															{...provided.droppableProps}
															ref={provided.innerRef}
															className={`p-2 ${snapshot.isDraggingOver ? "bg-base-300" : "bg-base-200"}`}
															style={{ minHeight: "3em" }}
														>
															{list.tasks && list.tasks.length > 1 &&
																list.tasks.map((task, taskIndex) => (
																	<Draggable draggableId={task.id.toString()} index={taskIndex} key={taskIndex}>
																		{(cardProvider, cardSnapshot) => (
																			<div
																				{...cardProvider.draggableProps}
																				{...cardProvider.dragHandleProps}
																				ref={cardProvider.innerRef}
																				className={`card shadow-sm mb-2 ${cardSnapshot.isDragging ? "bg-base-200" : "bg-base-100"}`}
																				data-bs-toggle="modal"
																				data-bs-target="#cardModal"
																			// onClick={() => setSelectedCard(data)}
																			>
																				<div className="card-body p-2 px-4" style={{ height: "4rem" }}>
																					<div className="flex items-center justify-between mb-2">
																						<span
																							// className={`badge ${renderPriorityStyle(data.priority)}`}
																							style={{ fontSize: ".75em" }}
																						>
																							{/* {data.priority} */}
																						</span>
																						{/* <span className="fw-light">{formatToDate(data.createdAt)}</span> */}
																					</div>
																					<h4 className="truncate card-title">{task.id}</h4>
																					<div className="flex items-center justify-between">
																						<div className="flex items-center">
																							{task.description && task.description !== "" && (
																								<i className="bi bi-list"></i>
																							)}
																							{/* {task.comments.length > 0 && (
																									<i className="bi bi-chat-left-dots me-1"></i>
																								)} */}
																						</div>
																					</div>
																				</div>
																			</div>
																		)}
																	</Draggable>
																))}
															{provided.placeholder}
														</div>
													)}
												</Droppable>
												<div className="bg-base-200 mb-2">
													{!newTask ? (
														<div
															className="d-flex flex-grow-1 justify-content-center pb-2"
															onClick={() => setNewTask(true)}
															style={{ cursor: "pointer" }}
														>
															<span className="font-bold">
																<i className="bi bi-plus"></i> Añadir tarea
															</span>
														</div>
													) : (
														<textarea
															className="textarea mx-2 mb-2"
															style={{ width: "93%" }}
															placeholder="¿Qué se debe hacer?"
															required
															autoFocus
															rows={3}
														// onChange={(e) => setNewCardName(e.target.value)}
														// onKeyPress={(e) => handleKeyPressed(e)}
														/>
													)}
												</div>
											</div>
										</div>
									)}
								</Draggable>
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
									className="ml-2 p-2 w-full"
									onSubmit={handleSubmit(onSubmit)}
								>
									<input
										type="text"
										autoFocus
										className={`${errors.title ? 'input-error ' : ''}input input-bordered w-full`}
										placeholder="Añadir nueva columna"
										{...register("title", {
											required: {
												value: true,
												message: "El nombre es obligatorio",
											},
										})}
										style={{ width: "16em" }}
									/>
									{errors.title && (
										<label className="label">
											<span className="label-text-alt text-error">El título es obligatorio</span>
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

