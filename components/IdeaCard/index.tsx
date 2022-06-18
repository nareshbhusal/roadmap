import type { IdeaPreview } from '../../types';
import {
  Flex,
  Stack,
  Link,
  Text,
  Badge,
  Tag,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react';

import { SettingsIcon, EditIcon} from '@chakra-ui/icons';

import { useRouter } from 'next/router'

import NextLink from 'next/link';

import { IoAnalytics, IoClose } from 'react-icons/io5';
import { VscFile } from 'react-icons/vsc';
import { HiOutlineDuplicate } from 'react-icons/hi';
import { MdTaskAlt } from 'react-icons/md';
import { db } from '../../db';

export interface IdeaCardProps {
  idea: IdeaPreview;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {

  const { title, createdOn, updatedOn, status, id, tags } = idea;

  const router = useRouter();
  const { orgname } = router.query;
  const ideaURL = `/${orgname}/ideas/${id}/edit`;

  const deleteIdea = () => {
    db.removeIdea(id!);
  }
  const archiveIdea = (): void => {
    db.setIdeaStatus(id!, 'archived');
  }

  const unarchiveIdea = (): void => {
    db.setIdeaStatus(id!, 'active');
  }

  const addToStory = (): void => {
    router.push(ideaURL);
  }

  const completeIdea = (): void => {
    db.setIdeaStatus(id!, 'completed');
  }

  const undoCompleteIdea = (): void => {
    db.setIdeaStatus(id!, 'active');
  }
  const removeMenuFocus = (): void => {
    setTimeout(() => {
      (document.activeElement as HTMLElement).blur();
    }, 0);
  }

  const cardPadding = '15px';

  return (
    <Stack
      as={'article'}
      spacing={'0px'}
      flex={1}
      minWidth={'300px'}
      maxWidth={'360px'}
      border={'1px solid transparent'}
      borderColor={'gray.100'}
      boxShadow= {'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'}
      // boxShadow={'sm'}
      borderRadius={'12px'}
      justify={'space-between'}
      align={'space-between'}
      background={'white'}
      _hover={{
        cursor: 'default'
      }}
      flexDirection={'row'}>

      <NextLink href={ideaURL}>
        <a
          style={{
            textDecoration: 'none',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        >
      <Stack
        display={'flex'}
        direction={'column'}
        w={'100%'}
        h={'100%'}
        spacing={'15px'}
        padding={cardPadding}
        flexDirection={'column'}>
            <Text
              as={'h3'}
              size={'md'}
              fontWeight={'semibold'}
              width={'100%'}
              maxWidth={'170px'}
              noOfLines={2}
            >
              {title}
            </Text>
        <Stack
          spacing={'10px'}
          color={'gray.500'}
          fontSize={'sm'}
          flexDirection={'column'}>
          <Stack color={'gray.500'} spacing={'2px'}>
            {/*dates*/}
            <Text
              fontSize={'xs'}
              suppressHydrationWarning>
              Created on: {new Date(Number(createdOn)).toLocaleDateString()}
            </Text>
            <Text
              fontSize={'xs'}
              suppressHydrationWarning>
              Updated on: {new Date(Number(updatedOn)).toLocaleDateString()}
            </Text>
          </Stack>
          {tags.length ?
          <Flex
            flexWrap={'wrap'}
          >
            {tags.map((tag, index) => (
              <Tag
                key={index}
                colorScheme={'teal'}
                variant={'outline'}
                size={'sm'}
                fontWeight={'semibold'}
                marginRight={'4px'}
                mb={'2px'}
                borderRadius={'20px'}
                padding={'6px 8px'}
                _hover={{
                  cursor: 'default'
                }}>
                {tag.text}
              </Tag>
            ))}
          </Flex> :
            null}
        </Stack>
      </Stack>
        </a>
      </NextLink>

      <Stack
        justify={'space-between'}
        padding={cardPadding}
        paddingLeft={0}
        align={'flex-end'}>
        <Badge
          textTransform={'capitalize'}
          variant={`badge-${status}`}
          size={'sm'}>
          {status}
        </Badge>
        <Menu onClose={removeMenuFocus}>
          <MenuButton
            as={IconButton}
            icon={<SettingsIcon
              color={'gray.700'}
              _focus={{
                color: 'red'
              }}
              padding={'0px'} />}
            background={'transparent'}
            isRound={true}
            outline='none'
            _focus={{
              outline: 'none',
              background: '#eee'
            }}
            _hover={{
              outline: 'none',
              background: '#eee'
            }}
            _active={{
              outline: 'none',
              background: '#eee'
            }}
            padding={'0px'}>
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
              <MenuItem onClick={undoCompleteIdea} icon={<VscFile />}>Undo completion</MenuItem>:
              <MenuItem onClick={completeIdea} icon={<VscFile />}>Complete</MenuItem>
            }
            {status !== 'archived'?
              <MenuItem icon={<HiOutlineDuplicate />} onClick={archiveIdea}>Archive</MenuItem>:
              <MenuItem icon={<HiOutlineDuplicate />} onClick={unarchiveIdea}>Unarchive</MenuItem>
            }
            <MenuItem icon={<IoClose />} onClick={deleteIdea}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Stack>
    </Stack>
  );
}

export default IdeaCard;
