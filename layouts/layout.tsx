import React from 'react';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import { TAG_COLORS } from '../lib/constants';

import {
  Flex,
  Heading,
  Stack
} from '@chakra-ui/react';

export interface ILayout {
    children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  const router = useRouter();
  const isBoardPage = Boolean(router.query.boardId);

    return (
    <Flex>
      <Sidebar
        passedBg={isBoardPage ? TAG_COLORS[2] : ''}
      />
      <Stack
        as={'main'}
        flexDirection={'column'}
        flex={'1'}
        overflowX={'hidden'}
        alignItems={'flex-start'}
        spacing={'35px'}
        bg={isBoardPage ? TAG_COLORS[2] : ''}
        // paddingTop={'15px'}
        // px={'30px'}
      >
        {children}
      </Stack>
    </Flex>
    );
}

export default Layout;
