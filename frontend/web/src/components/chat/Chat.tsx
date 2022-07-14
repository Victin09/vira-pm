import { ChannelAttributes } from "@tidify/common";
import { useSelectedChannel } from "../../store/useSelectedChannel";
import ChatArea from "./ChatArea";
import ChatSidebar from "./ChatSidebar";

export interface Props {}

const Chat: React.FC<Props> = () => {
  const selectedChannel = useSelectedChannel(
    (state) => state.selectedChannel
  ) as ChannelAttributes;

  return (
    <div className="flex w-full h-full">
      {/* Project Members */}
      <ChatSidebar />
      <h1>{selectedChannel.name}</h1>
    </div>
  );
};

export default Chat;
