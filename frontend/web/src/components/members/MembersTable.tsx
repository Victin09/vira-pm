import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Avatar,
    Badge,
} from "@chakra-ui/react";
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
        <>
            <Table color="#1D1C1B" bg="#FFFFFF" borderRadius="10px">
                <Thead>
                    <Tr borderColor="var(--background-secondary)">
                        <Th w="10%" color="#1D1C1B">
                            Avatar
                        </Th>
                        <Th color="#1D1C1B">Name</Th>
                        <Th color="#1D1C1B">Last online</Th>
                        <Th color="#1D1C1B">Joined</Th>
                        <Th color="#1D1C1B">Role</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data &&
                        data.success &&
                        data.data.map((u: UserAttributes) => (
                            <MembersRow
                                key={u.id}
                                name={u.username}
                                isOwner={selectedGuild?.ownerId === u.id}
                            />
                        ))}
                </Tbody>
            </Table>
        </>
    );
};

type MembersRowProps = {
    name: string;
    isOwner: boolean;
};

const MembersRow: React.FC<MembersRowProps> = ({ name, isOwner }) => {
    return (
        <>
            <Tr>
                <Td>
                    <Avatar />
                </Td>
                <Td>{name}</Td>
                <Td>Now</Td>
                <Td>{Math.floor(Math.random() * 12)}mo</Td>
                <Td>
                    <Badge bg="var(--background-primary)" color="white">
                        {isOwner ? "Owner" : "Member"}
                    </Badge>
                </Td>
            </Tr>
        </>
    );
};

export default MembersTable;

