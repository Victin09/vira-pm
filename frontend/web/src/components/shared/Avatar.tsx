import styled from "styled-components"
import { getInitials } from "../../utils/get-initials"

type AvatarProps = {
  children: string
}

const AvatarWrapper = styled.div`
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  color: #FFFFFF;
  line-height: 2.5em;
  text-align: center;
  background: #504E8F;
  font-weight: bold;
`

export const Avatar: React.FC<AvatarProps> = ({ children }) => {
  return (
    <AvatarWrapper>{getInitials(children)}</AvatarWrapper>
  )
}