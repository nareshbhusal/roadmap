import React from 'react';
import Sidebar from '../components/Sidebar';

import {
  Flex,
  Heading,
  Stack
} from '@chakra-ui/react';

export interface ILayout {
    children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
    return (
    <Flex>
      <Sidebar />
      <Stack
        flexDirection={'column'}
        flex={'1'}
        overflowX={'hidden'}
        alignItems={'flex-start'}
        spacing={'35px'}
        // background={'gray.50'}
        // paddingTop={'15px'}
        // px={'30px'}
      >
        {children}
      </Stack>
    </Flex>
    );
}

export default Layout;
