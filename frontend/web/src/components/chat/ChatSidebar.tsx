import { ChannelAttributes, UserAttributes } from "@tidify/common";
import { getMembers } from "../../api/guild";
import { useSelectedGuild } from "../../store/useSelectedGuild";
import { useQuery } from "react-query";
import { Loader } from "../shared/Loader";
import { getInitials } from "../../utils/get-initials";
import { useSelectedChannel } from "../../store/useSelectedChannel";
import { getChannels } from "../../api/channel";
import { useSocket } from "../../store/useSocket";
import CreateChannelModal from "./CreatChannelModal";
import { useEffect } from "react";

const Sidebar: React.FC = () => {
  const selectedGuild = useSelectedGuild((state) => state.selectedGuild);
  const { data, isLoading } = useQuery(
    ["members", selectedGuild?.id],
    () => getMembers(selectedGuild?.id),
    { enabled: !!selectedGuild }
  );

  const { select, selectedChannel } = useSelectedChannel();
  const channelQuery = useQuery(
    ["channels", selectedGuild?.id],
    () => getChannels(selectedGuild?.id),
    { enabled: !!selectedGuild }
  );
  const socket = useSocket((state) => state.socket);

  useEffect(() => {
    channelQuery &&
      channelQuery.data &&
      console.log("channelQuery", channelQuery.data);
  }, [channelQuery]);

  if (isLoading || !selectedGuild) return <Loader />;

  return (
    <div className="flex flex-col p-2 bg-base-200 w-52">
      <div className="w-full mb-5">
        <span className="mb-3 font-semibold">Usuarios</span>
        {data &&
          data.success &&
          data.data.map((u: UserAttributes) => (
            <div className="flex items-center cursor-pointer w-full hover:bg-base-300 rounded">
              <span className="bg-primary rounded p-2 px-3 text-base-content">
                {getInitials(u.username)}
              </span>
              <span className="ml-2 font-medium">{u.username}</span>
            </div>
          ))}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full">
          <span className="mb-3 font-semibold">Canales</span>
          <label htmlFor="createChannelModal" className="modal-button">
            +
          </label>
        </div>
        {!channelQuery!.isLoading &&
          channelQuery!.data.data &&
          channelQuery!.data.data.channels!.map(
            (channel: ChannelAttributes, i: number) => (
              <div
                key={i}
                className={`${
                  typeof selectedChannel !== "string" &&
                  (selectedChannel as ChannelAttributes).id === channel.id
                    ? "bg-base-300"
                    : "bg-base-200"
                }`}
                // isSelected={
                //   typeof selectedChannel !== "string" &&
                //   (selectedChannel as ChannelAttributes).id === channel.id
                // }
                // channel={channel}
                onClick={() => {
                  select(channel);
                  socket?.emit("join-channel", { channelId: channel.id });
                }}
              >
                {channel.name}
              </div>
            )
          )}
      </div>
      <CreateChannelModal />
    </div>
  );
};

export default Sidebar;
