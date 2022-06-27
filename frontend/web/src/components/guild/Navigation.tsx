import { Box, Center, Divider, Flex, Text, VStack, } from "@chakra-ui/layout"
import { Image, Tooltip, useDisclosure } from '@chakra-ui/react';
import { GuildAttributes } from "@tidify/common";
import { Plus } from "react-feather";
import { useQuery } from "react-query";
import { getGuilds } from "../../api/guild";
import CreateGuildModal from './CreateGuildModal';
import Logo from '../../assets/logo.png'
import { scrollbarStyles } from "../../utils/scrollbarStyles";
import { useSelectedGuild } from "../../store/useSelectedGuild";
import CornerLogo from "../shared/CornerLogo";
import { useSelectedChannel } from "../../store/useSelectedChannel";

interface Props {

};

const Navigation: React.FC<Props> = (props) => {
    const { data, isLoading } = useQuery("guilds", getGuilds);
    console.log('dataNvigation', data)
    const selectedGuild = useSelectedGuild(state => state.selectedGuild);

    const disclosure = useDisclosure();

    const handleAddGuild = () => {
        disclosure.onOpen();
    }

    return (
        <>
            <CornerLogo />

            <VStack
                position="fixed"
                h="100vh"
                w="70px"
                bg="#33344A"
                spacing="10px"
                paddingTop="4em"
                paddingBottom="var(--grid-gap)"
                overflow="auto"
                sx={{
                    "&::-webkit-scrollbar": {
                        display: 'none'
                    },
                }}
            >
                <Divider w="80%" />


                {!isLoading && data.data.map((guild: GuildAttributes) => (
                    <Guild key={guild.id} guild={guild} isSelected={selectedGuild?.id === guild.id} />
                ))}

                <GuildAddButton onClick={handleAddGuild} />
            </VStack>
            <CreateGuildModal disclosure={disclosure} />
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
        <Tooltip label={guild.name} placement="right" gutter={16} bg="#EAEAEC" color="#767472">
            <Box
                w="50px"
                h="50px"
                minHeight="50px"
                borderRadius="10px"
                zIndex="6"
                bg={!isSelected ? "#504E8F" : "#504E8F"}
                cursor={!isSelected ? undefined : 'pointer'}
                transition="all 200ms ease"
                sx={{
                    "&:hover": {
                        cursor: 'pointer',
                        transform: 'scale(1.1)'
                    },
                    "&:hover .guild-text": {
                        color: 'var(--background-secondary)',
                    }
                }}
                onClick={() => {
                    selectChannel("overview");
                    select(guild)
                }}
            >
                <Center>
                    <Text fontWeight="bold" color={!isSelected ? "#EAEAEC" : "#EAEAEC"} fontSize="xl" className="guild-text">{guild.name[0].toUpperCase()}</Text>
                </Center>
            </Box>
        </Tooltip>
    );
}

type GuildAddButtonProps = {
    onClick: () => void;
}

const GuildAddButton: React.FC<GuildAddButtonProps> = ({ onClick }) => {
    return (
        <Tooltip label="New Guild" placement="right" hasArrow gutter={16} bg="#EAEAEC" color="#767472">
            <Box
                onClick={onClick}
                w="50px"
                h="50px"
                minHeight="50px"
                borderRadius="10px"
                zIndex="6"
                bg="#504E8F"
                transition="all 200ms ease"
                sx={{
                    "&:hover": {
                        cursor: 'pointer',
                        transform: 'scale(1.1)'
                    },
                    "&:hover #plus-icon": {
                        color: 'var(--background-secondary)',
                    },
                }}
            >
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    w="100%"
                    h="100%"
                >
                    <Plus color="#EAEAEC" id="plus-icon" />
                </Flex>
            </Box>
        </Tooltip>
    );
}

