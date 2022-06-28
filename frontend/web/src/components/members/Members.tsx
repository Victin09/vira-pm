import React from 'react';
import MembersTable from './MembersTable';

interface Props {
  memberCount: number;
};

const Members: React.FC<Props> = ({ memberCount }) => {
  return (
    <div className='flex flex-col w-full h-full p-2'>
      <div className='w-full'>
        <div
          className='flex justify-between w-full mb-2'
        >
          <div className='flex items-center'>
            <input type="text" placeholder="Buscar..." className="input input-bordered w-full max-w-xs" />
            <span className='w-full ml-1'>{memberCount}{' '}{memberCount > 1 ? "miembros" : "miembro"}</span>
          </div>
          <button className='btn btn-primary'>Invitar</button>
        </div>
        <MembersTable />
      </div>
    </div>
  );
}

export default Members;