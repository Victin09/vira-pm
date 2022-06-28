import { GuildAttributes } from "@tidify/common";
import styled from "styled-components";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getGuilds } from "../../api/guild";
import CreateGuildModal from './CreateGuildModal';
import { useSelectedGuild } from "../../store/useSelectedGuild";
import { useSelectedChannel } from "../../store/useSelectedChannel";
import { useMe } from "../../hooks/useMe";
import { HStack, VStack, Text } from "@chakra-ui/react";
import { LogOut, Settings } from 'react-feather';
import IconWrapper from "../shared/IconWrapper";
import { logout } from "../../api/auth";
import { useHistory } from "react-router-dom";
import { Avatar } from "../shared/Avatar";

const SidenavContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 5em;
  /* position: fixed; */
  background-color: #33344A;
`

const SidenavLogo = styled.span`
  padding: 1em;
  font-size: larger;
  font-weight: bold;
  color: #FFFFFF;
`;

const SidenavUser = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  bottom: 0;
  position: absolute;
  margin-bottom: .25em;
`;

const SidenavUserText = styled.span`
  font-weight: 600;
  color: #FFFFFF;
`

const SidenavUserIcons = styled.div`
  display: flex;
`

const Navigation: React.FC = () => {
  const { data, isLoading } = useQuery("guilds", getGuilds);
  const selectedGuild = useSelectedGuild(state => state.selectedGuild);
  const [displayCreateGuildModal, setDisplayCreateGuildModal] = useState<boolean>(false)
  const { data: userData } = useMe()
  const mutation = useMutation(logout);
  const queryClient = useQueryClient();
  const history = useHistory()

  const handleAddGuild = (displayModal: boolean) => {
    setDisplayCreateGuildModal(displayModal)
  }

  const handleLogout = () => {
    mutation.mutate();
    queryClient.invalidateQueries('me');
    history.push('/')
  }

  return (
    <>
      <SidenavContainer>
        <SidenavLogo>VM</SidenavLogo>

        {!isLoading && data.data.map((guild: GuildAttributes) => (
          <Guild key={guild.id} guild={guild} isSelected={selectedGuild?.id === guild.id} />
        ))}
        <GuildAddButton onClick={() => setDisplayCreateGuildModal(true)} />

        <SidenavUser>
          <Avatar>{userData.data.username}</Avatar>
          <SidenavUserText>{!isLoading && userData.data.username}</SidenavUserText>
          <SidenavUserIcons>
            <IconWrapper icon={LogOut} tooltip={{ label: "Logout", placement: "top" }} h="17px" w="17px" onClick={handleLogout} />
            <IconWrapper icon={Settings} tooltip={{ label: "Settings", placement: "top" }} h="17px" w="17px" />
          </SidenavUserIcons>
        </SidenavUser>
      </SidenavContainer>
      <CreateGuildModal showModal={displayCreateGuildModal} setShowModal={handleAddGuild} />
    </>
  );
}

export default Navigation;

type GuildProps = {
  guild: GuildAttributes;
  isSelected: boolean;
}

const GuidWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #504E8F;
  color: #FFFFFF;
  border-radius: 10px;
  padding: .5em;
  width: 3em;
  margin: .25em;

  &:hover {
    cursor: pointer;
    transform: scale(1.1)
  }
`

const GuildText = styled.span`
  font-weight: bold;
  color: #FFFFFF;
  font-size: larger;
`

const Guild: React.FC<GuildProps> = ({ guild, isSelected }) => {
  const select = useSelectedGuild(state => state.select);
  const selectChannel = useSelectedChannel(state => state.select);
  return (
    <GuidWrapper
      onClick={() => {
        selectChannel("overview");
        select(guild)
      }}
    >
      <GuildText>{guild.name[0].toUpperCase()}</GuildText>
    </GuidWrapper>
  );
}

type GuildAddButtonProps = {
  onClick: () => void;
}

const GuildAddButton: React.FC<GuildAddButtonProps> = ({ onClick }) => {
  return (
    <GuidWrapper
      onClick={onClick}
    >
      <GuildText>
        +
      </GuildText>
    </GuidWrapper>
  );
}

