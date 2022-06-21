import {
  Flex,
  Divider,
  Button,
  IconButton,
  Text,
  Heading,
  Stack
} from '@chakra-ui/react';
import { MdArrowBackIosNew as ArrowIcon } from 'react-icons/md';

import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../db';
import { useLiveQuery } from "dexie-react-hooks";

import Logo from './Logo';
import SidebarLink, { LINK_MARGIN_LEFT, SidebarExternalLink } from './SidebarLink';
import { defaultSearchValues } from '../components/FilterBoards';
import { lightenColor } from '../lib/utils/';

const Sidebar: React.FC<{ passedBg?: string; }> = ({ passedBg }) => {
  const router = useRouter();
  const { orgname } = router.query;
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Fetch filtering by recently opened
  const boards = useLiveQuery(
    () => db.getBoards({
      searchTerm: '',
      sortBy: defaultSearchValues.sortBy
    })
  );

  passedBg = passedBg || 'gray.20';
  const backgroundColor = isOpen ? 'gray.20' : lightenColor(passedBg, 20);

  return (
    <Flex
      as={'aside'}
      minHeight={'100vh'}
      zIndex={220}
      height={'100vh'}
      position={'sticky'}
      flex={'0 0 auto'}
      top={'0%'}
      bottom={'0%'}
      align={'center'}
      border={'1px solid transparent'}
      borderRightColor={'blackAlpha.50'}
      borderLeft={'none'}
      flexDirection={'column'}
      paddingTop={'15px'}
      transition={'0.15s ease-in-out width'}
      width={isOpen ? '220px': '20px'}
      // opacity={isOpen? 1 : '0.7'}
      background={backgroundColor}
    >
      <Flex
        align={'center'}
        flexDirection={'row'}
        position={'relative'}
        width={'100%'}
        opacity={isOpen? 1: 0.8}
        marginBottom={'10px'}
        justify={'center'}>
        <Flex
          justifyContent={'center'}
          h={'100%'}
          w={'100%'}>
          {isOpen ?
            <Logo /> :
            null}
          <IconButton
            aria-label={'close'}
            icon={<ArrowIcon />}
          isRound={true}
          ref={toggleButtonRef}
          onClick={() => setIsOpen(!isOpen)}
          bg={'#fff'}
          color={'#111'}
          _focus={{
            outline: 'none',
            background: '#eee',
          }}
          boxShadow={'sm'}
          variant={'outline'}
          position={'absolute'}
          right={isOpen ? '0px' : `-${toggleButtonRef.current!.clientWidth/2}px`}
          size={'sm'}
        />
        </Flex>
      </Flex>
      {!isOpen ?
        null:

      <Flex
        // links
        align={'center'}
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
      }
    </Flex>
  );
}

{/* <ExternalLink href={`https://github.com/nareshbhusal/roadmap`}>
    </ExternalLink> */}

export default Sidebar;
