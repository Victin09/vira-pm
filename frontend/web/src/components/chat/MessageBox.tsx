import React from "react";
import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";

export interface Props {
    username: string;
    content: string;
    createdAt: string;
};

const MessageBox: React.FC<Props> = ({ username, createdAt, content }) => {
    return (
        <>
            <HStack
                p="20px 15px"
                w="100%"
                alignItems="start"
                borderBottom="1px solid var(--background-secondary)"
            >
                <Avatar />
                <VStack
                    alignItems="start"
                    spacing="5px"
                >
                    <HStack
                    >
                        <Text color="#1D1C1B" fontWeight="bold">{username}</Text>
                        <Text color="#1D1C1B">·</Text>
                        <Text color="#1D1C1B" fontSize="12px">{createdAt}</Text>
                    </HStack>
                    <Text color="#1D1C1B">{content}</Text>
                </VStack>
            </HStack>
        </>
    );
}

export default MessageBox;