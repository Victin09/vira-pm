import { TaskAttributes } from "@tidify/common"
import { Draggable } from "react-beautiful-dnd"
import { formatToDate } from "../../utils/dates"
import { renderPriorityStyle } from "../../utils/styles"

type KanbanTaskProps = {
  index: number,
  task: TaskAttributes
}

export const KanbanTask: React.FC<KanbanTaskProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id.toString() + '-' + task.name} index={index}>
      {(cardProvider, cardSnapshot) => (
        <div
          {...cardProvider.draggableProps}
          {...cardProvider.dragHandleProps}
          ref={cardProvider.innerRef}
          className={`card shadow-sm mb-2 ${cardSnapshot.isDragging ? "bg-base-200" : "bg-base-100"}`}
        // onClick={() => setSelectedCard(data)}
        >
          <div className="card-body p-2 px-4">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`badge ${renderPriorityStyle(task.priority)}`}
                style={{ fontSize: ".75em" }}
              >
                {task.priority}
              </span>
              {/* {task.createdAt && (<span className="fw-light">{formatToDate(task.createdAt)}</span>)} */}
            </div>
            <h4 className="truncate card-title">{task.name}</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {task.description && task.description !== "" && (
                  <i className="bi bi-column"></i>
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
  )
}