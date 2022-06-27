import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import React from "react";
// import Logo from '../../assets/logo.png'

interface Props { };

const CornerLogo: React.FC<Props> = () => {
    return (
        <Box
            position="absolute"
            top="0"
            left="0"
            w="auto"
            h="auto"
            bg="#33344A"
            color="#EAEAEC"
            p="20px"
            zIndex="4"
        >
            VM
        </Box>
    );
}

export default CornerLogo;