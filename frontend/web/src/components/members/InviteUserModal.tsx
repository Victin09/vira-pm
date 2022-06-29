import { GuildAttributes, UserAttributes } from "@tidify/common"
import Select, { ActionMeta, MultiValue } from 'react-select'
import { useQuery } from "react-query"
import { getUsers } from "../../api/users"
import { ReactEventHandler } from "react"

type InviteUserModalProps = {
  guildUsers: UserAttributes[]
  selectedGuild: GuildAttributes
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({ guildUsers, selectedGuild }) => {
  const { data, isLoading } = useQuery(['getUsers', selectedGuild.id], getUsers)

  const handleChange = (newValue: MultiValue<UserAttributes>) => {
    console.log({ newValue })
  }

  if (isLoading) {
    return (
      <progress className="progress w-56"></progress>
    )
  }

  return (
    <>
      <input type="checkbox" id="inviteUserModal" className="modal-toggle" />
      <label htmlFor="inviteUserModal" className="modal">
        <label className="modal-box">
          <h3 className="font-bold text-lg mb-3">Invita usuarios a este proyecto!</h3>
          <Select
            isMulti
            name="colors"
            options={data.data}
            onChange={handleChange}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Busca un usuario..."
            noOptionsMessage={() => "No existen más usuarios"}
            getOptionLabel={(option: UserAttributes) => `${option.firstName} ${option.lastName}`}
            getOptionValue={(option: UserAttributes) => option.email}
          />
          <div className="modal-action">
            <label htmlFor="inviteUserModal" className="btn">Invitar!</label>
          </div>
        </label>
      </label>
    </>
  )
}