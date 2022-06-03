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


import { SettingsIcon, EditIcon} from '@chakra-ui/icons';

import { useRouter } from 'next/router'

import NextLink from 'next/link';

import { IoAnalytics, IoClose } from 'react-icons/io5';
import { VscFile } from 'react-icons/vsc';
import { HiOutlineDuplicate } from 'react-icons/hi';
import { MdTaskAlt } from 'react-icons/md';

// TODO: non-cringe animations

export interface BoardCardProps {
  board: BoardPreview;
}

const BoardCard: React.FC<BoardCardProps> = ({ board }) => {

  const { name, id } = board;

  const { orgname } = useRouter().query;
  const ideaURL = `/${orgname}/roadmap/${id}`;

  const deleteGuide = () => {
    //
    window.alert('deleted');
  }
  const archiveBoard = (): void => {
    //
    window.alert('archiving');
  }

  const unarchiveBoard = (): void => {
    //
    window.alert('un-archiving');
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
      boxShadow= {'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'}
      //      boxShadow= {'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'}
      //      boxShadow= {'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'}
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
        <Badge
          textTransform={'capitalize'}
          variant={`badge-${status}`}
          size={'sm'}>
          {status}
        </Badge>
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
            {status !== 'archived'?
              <MenuItem icon={<HiOutlineDuplicate />} onClick={archiveBoard}>Archive</MenuItem>:
              <MenuItem icon={<HiOutlineDuplicate />} onClick={unarchiveBoard}>Unarchive</MenuItem>
            }
            <MenuItem icon={<IoClose />} onClick={deleteGuide}>Delete</MenuItem>
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
