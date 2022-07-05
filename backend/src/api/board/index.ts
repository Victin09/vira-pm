import { ColumnAttributes, createColumnSchema, updateColumnSchema } from "@tidify/common";
import { Request, Response, Router } from "express";
import { InferType } from "yup";
import Board from "../../db/models/Board";
import Column from "../../db/models/Column";
import Task from "../../db/models/Task";

export const router = Router();

/**
 * Get all columns
 * @route {GET} /api/v1/boards/:boardId/columns/
 */
router.get("/:boardId/columns", async (req: Request, res: Response) => {
  const boardId = req.params.boardId;

  const columns = await Column.findAll({
    where: { boardId },
    include: [
      {
        model: Task,
        as: "tasks",
      },
    ],
  });

  const result = columns.sort((a, b) => a.order - b.order)
  return res
    .status(200)
    .json({
      data: result,
      message: "Successfully found all columns!",
      success: true,
    });
});

/**
 * Create a new column
 * @route {POST} /api/v1/boards/:boardId/columns
 */
router.post("/:boardId/columns", async (req: Request, res: Response) => {
  const boardId = req.params.boardId;

  let validatedEvent: InferType<typeof createColumnSchema>;
  try {
    validatedEvent = await createColumnSchema.validate(req.body);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: e, success: false });
  }

  const order = await Column.count({
    where: {
      boardId: boardId
    }
  })
  const createdColumn = await Column.create({
    ...validatedEvent,
    amount: 0,
    order: order + 1,
    boardId: parseInt(boardId),
  });

  return res
    .status(200)
    .json({
      data: createdColumn,
      message: "Successfully created column!",
      success: true,
    });
});

/**
 * Update a column
 * @route {PUT} /api/v1/boards/:boardId/columns/:columnId
 */
router.put(
  "/:boardId/columns",
  async (req: Request, res: Response) => {
    const boardId = req.params.boardId;
    const columns: ColumnAttributes[] = req.body.columns

    let validatedEvent: InferType<typeof updateColumnSchema>;
    try {
      validatedEvent = await updateColumnSchema.validate(columns[0]);
    } catch (e) {
      console.error(e);
      return res.status(400).json({ message: e, success: false });
    }

    for await (const column of columns) {
      const col = await Column.findOne({
        where: {
          id: column.id
        }
      })
      if (col) {
        col.order = column.order;
        col.save();
      }
      // await Column.update({ order: column.oder }, {
      //   where: {
      //     id: column.id
      //   }
      // })
    }

    const result = columns.sort((a, b) => a.order - b.order);
    return res
      .status(200)
      .json({
        data: result,
        message: "Successfully update columns!",
        success: true,
      });
  }
);

/**
 * Create a new column
 * @route {DELETE} /api/v1/boards/:boardId/columns/:columnId
 */
router.delete(
  "/boards/h:boardId/columns/:columnId",
  async (req: Request, res: Response) => { }
);
