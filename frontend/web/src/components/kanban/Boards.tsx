import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getBoards } from '../../api/board';
import { useSelectedGuild } from '../../store/useSelectedGuild';
import CreateBoardModal from './CreateBoardModal';
import { BoardAttributes } from '@tidify/common';
import KanbanBoard from './KanbanBoard';

const Boards: React.FC = () => {
  const selectedGuild = useSelectedGuild((state) => state.selectedGuild);
  const { data, isLoading } = useQuery(
    "boards",
    () => getBoards(selectedGuild?.id),
    { enabled: !!selectedGuild }
  );

  const [selectedBoard, selectBoard] = useState<BoardAttributes | null>(null);

  if (isLoading) return null;

  return (
    <>
      {!selectedBoard &&
        <div className='flex flex-col w-full m-1'>
          <label htmlFor="createBoardModal" className="btn btn-primary w-44 modal-button">Crear un nuevo tablero</label>
          <div className='flex flex-wrap mt-10'>
            {data && data.success && data.data.map((board: BoardAttributes, index: number) => (
              <div className="card w-52 bg-base-200 shadow-md hover:scale-105 cursor-pointer" key={index} onClick={() => selectBoard(board)}>
                <div className="card-body">
                  <h2 className="card-title truncate">{board.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      {selectedBoard && <KanbanBoard board={selectedBoard!} />}
      <CreateBoardModal />
    </>
  );
}

export default Boards;