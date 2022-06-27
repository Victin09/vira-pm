import { Box, Text } from '@chakra-ui/react';
import { Hash } from 'react-feather';

export interface Props {
    name: string;
};

const Title: React.FC<Props> = ({ name }) => {
    return (
        <>
            <Box
                flex="1"
                borderRadius="10px"
                bg="var(--background-secondary-alt)"
                margin="10px"
                p="10px"
            >
                <Text fontSize="2xl" color="#1D1C1B" d="flex" alignItems="center" h="100%" fontWeight="bold">
                    <Hash color="#1D1C1B" />{name}
                </Text>

            </Box>
        </>
    );
}

export default Title;