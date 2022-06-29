import { GuildAttributes, UserAttributes } from "@tidify/common";

type MembersTableProps = {
  users: UserAttributes[]
  selectedGuild: GuildAttributes
}

const MembersTable: React.FC<MembersTableProps> = ({ users, selectedGuild }) => {
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
          {users &&
            users.map((u: UserAttributes, index: number) => (
              <tr className="hover" key={index}>
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

