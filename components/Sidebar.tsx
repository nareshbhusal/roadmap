import {
  Flex,
  Divider,
  Text,
  Heading,
  Stack
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { db } from '../db';
import { useLiveQuery } from "dexie-react-hooks";

import Logo from './Logo';
import SidebarLink, { LINK_MARGIN_LEFT, SidebarExternalLink } from './SidebarLink';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { orgname } = router.query;

  // TODO: Fetch filtering by recently opened
  // -- add lastOpened prop to boards table which updates every time getBoard is called
  const boards = useLiveQuery(
    () => db.getBoards()
  );

  return (
    <Flex
      as={'aside'}
      minHeight={'100vh'}
      height={'100vh'}
      position={'sticky'}
      flex={'0 0 auto'}
      top={'0%'}
      bottom={'0%'}
      align={'center'}
      // border={'2px solid transparent'}
      // TODO change ^
      border={'1px solid transparent'}
      borderRightColor={'blackAlpha.50'}
      borderLeft={'none'}
      flexDirection={'column'}
      paddingTop={'15px'}
      width={'202px'}
      // TODO change ^
      // width={'215px'}
      background={'gray.20'}
      // TODO change ^
      // background={'white'}
    >

      <Flex
        // logo area
        align={'center'}
        // border={'1px solid blue'}
        flexDirection={'column'}
        width={'100%'}
        marginBottom={'10px'}
        justify={'center'}>
        <Logo />
      </Flex>

      <Flex
        // links
        align={'center'}
        //TODO remove padding
        // padding={'7.5px'}
        flexDirection={'column'}
        width={'100%'}
        py={'10px'}
        height={'100%'}
        justifyContent={'space-between'}
        justify={'center'}>
        <Flex
          // main links
          // border={'1px solid red'}
          align={'center'}
          flexDirection={'column'}
          width={'100%'}
          justify={'center'}>

          <SidebarLink
            href={`/${orgname}/ideas`}
            name={'Ideas'} />
          <SidebarLink
            href={`/${orgname}/boards`}
            name={'Boards'} />

          {boards?
            <>
              <Divider my={'1rem'} color={'red'} />
              <Stack
                width={'100%'}
              >
                <Heading
                  as={'h3'}
                  marginLeft={LINK_MARGIN_LEFT}
                  size={'sm'}
                  color={'gray.700'}
                  fontWeight={'semibold'}
                >
                  My Boards
                </Heading>
                <Stack
                  overflowY={'auto'}
                  height={{ base: '250px', md: '300px' }}
                  spacing={'0px'}>
                  {boards.map((board: any) => (
                    <SidebarLink
                      key={board.id}
                      name={board.name}
                      href={`/${orgname}/roadmap/${board.id}`} />
                  ))}
                </Stack>
                <Divider my={'1rem'} color={'red'} />
              </Stack>
            </>
            :
            <Flex
              width={'100%'}
              align={'center'}
              justify={'center'}
              color={'gray.600'}
            >
              <Text>Loading Boards...</Text>
            </Flex>
          }

        </Flex>
        <Flex
          // misc links
          flexDirection={'column'}
          align={'center'}
          width={'100%'}
          justify={'center'}>
          <SidebarLink
            href={`/${orgname}/settings`}
            name={'Settings'} />
          <SidebarExternalLink
            href={'https://github.com/nareshbhusal/roadmap'}
            name={'Github'} />
        </Flex>
      </Flex>
    </Flex>
  );
}

{/* <ExternalLink href={`https://github.com/nareshbhusal/roadmap`}>
    </ExternalLink> */}

export default Sidebar;
