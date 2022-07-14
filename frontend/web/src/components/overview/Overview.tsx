import React from "react";
import { Selection, useSelectedChannel } from "../../store/useSelectedChannel";
import { useSelectedGuild } from "../../store/useSelectedGuild";

type OptionsProp = {
  name: string;
  description: string;
  value: Selection;
};

const Overview: React.FC = () => {
  const selectedGuild = useSelectedGuild((state) => state.selectedGuild);
  const { select } = useSelectedChannel();
  // const options = ['overview', 'members', 'calendar', 'kanban']
  const options: OptionsProp[] = [
    {
      name: "Miembros",
      description: "¿Quieres añadir un usuario al proyecto?",
      value: "members",
    },
    {
      name: "Calendario",
      description: "Un calendario con eventos",
      value: "calendar",
    },
    {
      name: "Tablero kanban",
      description: "Un tablero en el que puedes orgarnizar el trabajo",
      value: "kanban",
    },
    {
      name: "Chat",
      description: "Un chat para hablar con los miembros del proyecto",
      value: "chat",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full m-1">
      {selectedGuild ? (
        <>
          <h1 className="font-bold text-xl">
            Bienvenido a {selectedGuild?.name.toUpperCase()}
          </h1>
          <span>¿Qué quieres hacer hoy?</span>
          <div className="flex flex-wrap items-center justify-center mt-3">
            {options.map((option, index) => (
              <div
                className="card w-72 h-36 bg-base-200 shadow-md m-1 hover:scale-105 cursor-pointer"
                key={index}
                onClick={() => select(option.value)}
              >
                <div className="card-body">
                  <h2 className="card-title">{option.name}</h2>
                  <p>{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h1 className="text-2xl">Selecciona un proyecto!</h1>
      )}
    </div>
  );
};

export default Overview;
