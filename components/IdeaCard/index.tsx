import type { IdeaPreview } from '../../types';
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

import { SettingsIcon, EditIcon} from '@chakra-ui/icons';

import { useRouter } from 'next/router'

import NextLink from 'next/link';
import { db } from '../../db';

import { IoAnalytics, IoClose } from 'react-icons/io5';
import { VscFile } from 'react-icons/vsc';
import { HiOutlineDuplicate } from 'react-icons/hi';
import { MdTaskAlt } from 'react-icons/md';

// TODO non-cringe animations

export interface IdeaCardProps {
  idea: IdeaPreview;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {

  const { title, createdOn, updatedOn, status, id, tags } = idea;

  const { orgname } = useRouter().query;
  const ideaURL = `/${orgname}/ideas/${id}/edit`;

  const deleteGuide = () => {
    //
    window.alert('deleted');
  }
  const archiveGuide = (): void => {
    //
    window.alert('archiving');
  }

  const unarchiveGuide = (): void => {
    //
    window.alert('un-archiving');
  }

  const addToStory = (): void => {
    //
    window.alert('add to story');
  }

  const completeGuide = (): void => {
    //
    window.alert('complete guide');
  }

  const undoCompleteGuide = (): void => {
    //
    window.alert('undo complete');
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
              {title}
            </Text>
          </Link>
        </NextLink>
        <Stack
          spacing={'0'}
          color={'gray.500'}
          fontSize={'sm'}
          flexDirection={'column'}>
          <Text
            suppressHydrationWarning>
            Created on: {new Date(Number(createdOn)).toLocaleDateString()}
          </Text>
          <Text
            suppressHydrationWarning>
            Updated on: {new Date(Number(updatedOn)).toLocaleDateString()}
          </Text>
          <Flex
            marginTop={'5px'}
          >
            {tags.map((tag, index) => (
              <Badge
                key={index}
                bg={'teal'}
                variant={'solid'}
                fontSize={'sm'}
                fontWeight={'semibold'}
                marginRight={'5px'}
                marginBottom={'5px'}
                borderRadius={'10px'}
                padding={'6px'}
                _hover={{
                  cursor: 'default'
                }}>
                {tag.text}
              </Badge>
            ))}
          </Flex>
        </Stack>
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
            <MenuItem onClick={addToStory} icon={<MdTaskAlt />}>Add to story</MenuItem>
            <NextLink
              href={ideaURL}
            >
              <Link href={ideaURL}
                _hover={{
                  textDecoration: 'none'
                }}
              >
                <MenuItem icon={<EditIcon />}>Settings</MenuItem>
              </Link>
            </NextLink>
            {status==='completed'?
              <MenuItem onClick={undoCompleteGuide} icon={<VscFile />}>Undo completion</MenuItem>:
              <MenuItem onClick={completeGuide} icon={<VscFile />}>Complete</MenuItem>
            }
            {status !== 'archived'?
              <MenuItem icon={<HiOutlineDuplicate />} onClick={archiveGuide}>Archive</MenuItem>:
              <MenuItem icon={<HiOutlineDuplicate />} onClick={unarchiveGuide}>Unarchive</MenuItem>
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

export default IdeaCard;
