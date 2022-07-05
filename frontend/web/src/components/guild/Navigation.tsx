import { GuildAttributes } from "@tidify/common";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getGuilds } from "../../api/guild";
import CreateGuildModal from './CreateGuildModal';
import { useSelectedGuild } from "../../store/useSelectedGuild";
import { useSelectedChannel } from "../../store/useSelectedChannel";
import { useMe } from "../../hooks/useMe";
import { logout } from "../../api/auth";
// import { useHistory } from "react-router-dom";
import { AiFillAppstore, AiOutlinePlus } from 'react-icons/ai'
import { useNavigate } from "react-router-dom";

const Navigation: React.FC = () => {
  const { data, isLoading } = useQuery("guilds", getGuilds);
  const selectedGuild = useSelectedGuild(state => state.selectedGuild);
  const { select } = useSelectedChannel()
  const [displayCreateGuildModal, setDisplayCreateGuildModal] = useState<boolean>(false)
  const { data: userData } = useMe()
  const mutation = useMutation(logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const handleAddGuild = (displayModal: boolean) => {
    setDisplayCreateGuildModal(displayModal)
  }

  const handleLogout = () => {
    mutation.mutate();
    queryClient.invalidateQueries('me');
    navigate('/')
  }

  return (
    <>
      <div className="flex flex-col items-center content-center w-20 h-full bg-base-200 border-r-2 border-base-300 shadow">
        <span className="p-2 font-bold text-2xl">VM</span>

        {!isLoading && data.data.map((guild: GuildAttributes) => (
          <Guild key={guild.id} guild={guild} isSelected={selectedGuild?.id === guild.id} />
        ))}
        <GuildAddButton onClick={() => setDisplayCreateGuildModal(true)} />

        <div className="flex flex-col absolute bottom-0 mb-1">
          {selectedGuild && (
            <div className="dropdown dropdown-right dropdown-end">
              <label tabIndex={0} className="btn btn-primary m-1"><AiFillAppstore /></label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => select('members')}>Usuarios</a></li>
                <li><a onClick={() => select('calendar')}>Calendario</a></li>
                <li><a onClick={() => select('kanban')}>Kanban</a></li>
              </ul>
            </div>
          )}
          <span className="font-semibold">{userData.data.username}</span>
          {/* <SidenavUserText>{!isLoading && userData.data.username}</SidenavUserText>
          <SidenavUserIcons>
            <IconWrapper icon={LogOut} tooltip={{ label: "Logout", placement: "top" }} h="17px" w="17px" onClick={handleLogout} />
            <IconWrapper icon={Settings} tooltip={{ label: "Settings", placement: "top" }} h="17px" w="17px" />
          </SidenavUserIcons> */}
        </div>
      </div>
      <CreateGuildModal showModal={displayCreateGuildModal} setShowModal={handleAddGuild} />
    </>
  );
}

export default Navigation;

type GuildProps = {
  guild: GuildAttributes;
  isSelected: boolean;
}

const Guild: React.FC<GuildProps> = ({ guild, isSelected }) => {
  const select = useSelectedGuild(state => state.select);
  const selectChannel = useSelectedChannel(state => state.select);
  return (
    <div
      className="btn btn-primary w-12 mt-1 flex items-center justify-center p-2 cursor-pointer hover:scale-110"
      onClick={() => {
        selectChannel("overview");
        select(guild)
      }}
    >
      <span className="font-semibold text-white">{guild.name[0].toUpperCase()}</span>
    </div>
  );
}

type GuildAddButtonProps = {
  onClick: () => void;
}

const GuildAddButton: React.FC<GuildAddButtonProps> = ({ onClick }) => {
  return (
    <label htmlFor="createGuildModal" className="modal-button btn btn-primary w-12 mt-1 flex items-center justify-center p-2 cursor-pointer hover:scale-110"><AiOutlinePlus /></label>
  );
}

