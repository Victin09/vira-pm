import Button from '../../ui/Button';
import { HStack, Text, VStack } from '@chakra-ui/layout';
import { Flex, InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
import React from 'react';
import { Search } from 'react-feather';
import BoxWrapper from '../shared/BoxWrapper';
import MembersTable from './MembersTable';

interface Props {
    memberCount: number;
};

const Members: React.FC<Props> = ({ memberCount }) => {
    return (
        <BoxWrapper>
            <VStack w="100%">
                <Flex
                    justifyContent="space-between"
                    w="100%"
                >
                    <HStack bg="#FFFFFF" borderRadius="10px" padding="10px">
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<Search color="#1D1C1B" />}
                            />
                            <Input type="text" placeholder="Seach"
                                sx={{
                                    "&::-webkit-input-placeholder": {
                                        color: '#1D1C1B'
                                    }
                                }}
                            />
                        </InputGroup>
                        <HStack>
                            <Text color="#1D1C1B" fontSize="16px">{memberCount}</Text>
                            <Text color="#1D1C1B" fontSize="16px">{memberCount > 1 ? "members" : "member"}</Text>
                        </HStack>
                    </HStack>
                    <Button>Invite</Button>
                </Flex>
                <MembersTable />
            </VStack>
        </BoxWrapper>
    );
}

export default Members;