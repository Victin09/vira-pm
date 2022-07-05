import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { generateGuildInvite, getMembers } from '../../api/guild';
import { useSelectedGuild } from '../../store/useSelectedGuild';
import { InviteUserModal } from './InviteUserModal';
import MembersTable from './MembersTable';

interface Props {
  memberCount: number;
};

const Members: React.FC<Props> = ({ memberCount }) => {
  const selectedGuild = useSelectedGuild((state) => state.selectedGuild);
  const [invitationLink, setInvitationLink] = useState<string>('')
  const { data, isLoading } = useQuery(
    ["members", selectedGuild?.id],
    () => getMembers(selectedGuild?.id),
    { enabled: !!selectedGuild }
  );
  const mutation = useMutation(generateGuildInvite, {
    onSuccess: (data) => {
      if (data.success) {
        console.log('invite link', data)
        setInvitationLink(data.message)
      }
    }
  });

  console.log({ isLoading })
  if (isLoading) {
    return (
      <progress className="progress w-56"></progress>
    )
  }

  return (
    <>
      <div className='flex flex-col w-full h-full p-2'>
        <div className='w-full'>
          <div
            className='flex justify-between w-full mb-2'
          >
            <div className='flex items-center'>
              <input type="text" placeholder="Buscar..." className="input input-bordered w-full max-w-xs" />
              <span className='w-full ml-1'>{memberCount}{' '}{memberCount > 1 ? "miembros" : "miembro"}</span>
            </div>
            <button className='btn btn-primary' onClick={() => mutation.mutate(selectedGuild!.id)}>{mutation.isLoading ?
              <svg role="status" className="w-8 h-8 mr-2 text-primary animate-spin fill-base-100" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
              </svg>
              : 'Invitar'}</button>
          </div>
          <MembersTable users={data.data} selectedGuild={selectedGuild!} />
        </div>
        {invitationLink && (
          <div className="alert shadow-lg absolute z-50 w-2/4 right-1 bottom-1 bg-info">
            <div>
              <div>
                <h3 className="font-bold mb-1">Envía este enlace a las personas que quieras invitar!</h3>
                <div className="text-xs italic">{invitationLink}</div>
              </div>
            </div>
            <div className="flex-none">
              <button className="btn btn-sm" onClick={() => setInvitationLink('')}>X</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Members;