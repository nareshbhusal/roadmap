import {
  Flex,
  Stack,
  Link,
  Text,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react';
import { BoardPreview } from '../types';
import { db } from '../db';


import { SettingsIcon, EditIcon} from '@chakra-ui/icons';

import { useRouter } from 'next/router'

import NextLink from 'next/link';

import { IoAnalytics, IoClose } from 'react-icons/io5';
import { VscFile } from 'react-icons/vsc';
import { HiOutlineDuplicate } from 'react-icons/hi';
import { MdTaskAlt } from 'react-icons/md';

export interface BoardCardProps {
  board: BoardPreview;
}

const BoardCard: React.FC<BoardCardProps> = ({ board }) => {

  const { name, id, archived } = board;

  const { orgname } = useRouter().query;
  const ideaURL = `/${orgname}/roadmap/${id}`;

  const deleteBoard = () => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      db.deleteBoard(id!);
    }
  }
  const archiveBoard = (): void => {
    db.archiveBoard(id!);
  }

  const unarchiveBoard = (): void => {
    db.unarchiveBoard(id!);
  }

  const removeMenuFocus = (): void => {
    // window.alert('removing focus');
    setTimeout(() => {
      (document.activeElement as HTMLElement).blur();
    }, 0);
  }

  return (
    <Stack
      display={'flex'}
      direction={'row'}
      spacing={'40px'}
      minWidth={'300px'}
      maxWidth={'400px'}
      border={'1px solid transparent'}
      borderColor={'gray.100'}
      boxShadow={'sm'}
      borderRadius={'12px'}
      justify={'space-between'}
      align={'space-between'}
      background={'white'}
      _hover={{
        cursor: 'default'
      }}
      padding={'15px'}
      flexDirection={'row'}>

      <Stack
        display={'flex'}
        direction={'column'}
        spacing={'25px'}
        flexDirection={'column'}>
        <NextLink href={ideaURL}>
          <Link
            _hover={{
              textDecoration: 'none'
            }}
            _focus={{
              textDecoration: 'underline',
              outline: 'none'
            }}
            href={ideaURL}>
            <Text
              as={'h2'}
              size={'md'}
              fontWeight={'semibold'}
              maxWidth={'170px'}
              // isTruncated // TODO: truncate somehow
            >
              {name}
            </Text>
          </Link>
        </NextLink>
      </Stack>

      <Flex
        justify={'space-between'}
        align={'flex-end'}
        flexDirection={'column'}>
        {archived ?

        <Badge
          textTransform={'capitalize'}
          variant={`badge-${status}`}
          size={'sm'}>
          {'archived'}
        </Badge>
        : null}
        <Menu onClose={removeMenuFocus}>
          <MenuButton
            as={IconButton}
            background={'transparent'}
            isRound={true}
            outline='none'
            //            _focus={{
            //              outline: 'none',
            //              background: 'transparent'
            //            }}
            _hover={{
              outline: 'none',
              background: 'transparent'
            }}
            _active={{
              outline: 'none',
              background: 'transparent'
            }}
            padding={'0px'}>
            <SettingsIcon
              color={'gray.700'}
              _focus={{
                color: 'red'
              }}
              padding={'0px'} />
          </MenuButton>
          <MenuList fontSize={'sm'}>
            <NextLink
              href={ideaURL}
            >
              <Link href={ideaURL}
                _hover={{
                  textDecoration: 'none'
                }}
              >
                <MenuItem icon={<EditIcon />}>Open</MenuItem>
              </Link>
            </NextLink>
            {!archived ?
              <MenuItem icon={<HiOutlineDuplicate />} onClick={archiveBoard}>Archive</MenuItem>:
              <MenuItem icon={<HiOutlineDuplicate />} onClick={unarchiveBoard}>Unarchive</MenuItem>
            }
            <MenuItem icon={<IoClose />} onClick={deleteBoard}>Delete</MenuItem>
          </MenuList>
        </Menu>
        {/* <Text
            fontWeight={'bold'}
          // TODO options icon
          fontSize={'xl'}>
          ...
          </Text> */}
      </Flex>
    </Stack>
  );
}

export default BoardCard;
