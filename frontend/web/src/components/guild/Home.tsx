import { useSelectedChannel } from "../../store/useSelectedChannel";
import Chat from "../chat/Chat";
import Layout from "../shared/Layout";
import Navigation from "./Navigation";
import Calendar from "../calendar/Calendar";
import Members from "../members/Members";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../store/useSocket";
import shallow from "zustand/shallow";
import Overview from "../overview/Overview";
import Boards from "../kanban/Boards";
import { useMutation } from "react-query";
import { acceptGuildInvite } from "../../api/guild";
import { useSearchParams } from "react-router-dom";

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { select, selectedChannel } = useSelectedChannel();
  const { connect, disconnect } = useSocket(
    (state) => ({ connect: state.connect, disconnect: state.disconnect }),
    shallow
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const mutation = useMutation(acceptGuildInvite, {
    onSuccess: (data) => {
      if (data.success) {
        select("overview");
      } else {
        switch (data.message) {
          case "Link is expired!":
            setErrorMessage("La invitación ha caducado");
            break;
          case "You are already in the guild!":
            setErrorMessage("Ya tienes acceso a este proyecto");
            select("overview");
            break;
          default:
            break;
        }
      }
    },
  });

  useEffect(() => {
    const invite = searchParams.get("invite");
    if (invite) {
      mutation.mutate(invite);
      searchParams.delete("invite");
      setSearchParams(searchParams, {
        replace: true,
      });
    }
    connect();

    return () => disconnect();
  }, []);

  const currentView = () => {
    console.log("currentView", selectedChannel);
    if (selectedChannel === "overview") return <Overview />;
    if (selectedChannel === "members") return <Members memberCount={1} />;
    if (selectedChannel === "calendar") return <Calendar />;
    if (selectedChannel === "kanban") return <Boards />;
    if (selectedChannel === "chat") return <Chat />;
  };

  return (
    <div className="flex w-full h-full">
      {errorMessage && (
        <div className="alert shadow-lg absolute z-50 w-3/4 right-2 mt-2 bg-error">
          <div>
            <div>
              <h3 className="font-bold mb-1">{errorMessage}</h3>
            </div>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm" onClick={() => setErrorMessage("")}>
              X
            </button>
          </div>
        </div>
      )}
      <Navigation />
      <Layout>
        {/* <ChannelSidebar /> */}
        {currentView()}
      </Layout>
    </div>
  );
};

export default Home;
