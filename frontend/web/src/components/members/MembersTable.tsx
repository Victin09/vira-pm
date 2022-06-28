import { UserAttributes } from "@tidify/common";
import { useQuery } from "react-query";
import { getMembers } from "../../api/guild";
import { useSelectedGuild } from "../../store/useSelectedGuild";

interface Props { }

const MembersTable: React.FC<Props> = () => {
  const selectedGuild = useSelectedGuild((state) => state.selectedGuild);
  const { data, isLoading } = useQuery(
    ["members", selectedGuild?.id],
    () => getMembers(selectedGuild?.id),
    { enabled: !!selectedGuild }
  );

  if (isLoading) return null;

  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.success &&
            data.data.map((u: UserAttributes, index: number) => (
              <tr className="hover">
                <td>{index}</td>
                <td>
                  <div>
                    <div className="font-bold">{u.firstName}{' '}{u.lastName}</div>
                    <div className="text-sm opacity-50">{u.email}</div>
                  </div>
                </td>
                <td>
                  <div className="badge badge-primary">{selectedGuild?.ownerId === u.id ? "Administrador" : "Usuario"}</div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
};

export default MembersTable;

