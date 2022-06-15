import {
  Flex,
  Stack,
  HStack,
  Box,
  Heading,
  Input,
  Button,
  IconButton,
  InputGroup,
  InputAddon,
  InputRightAddon,
  InputRightElement,

  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { useSortable } from "@dnd-kit/sortable";
import { useState, useRef, useEffect } from 'react';
import {CSS} from '@dnd-kit/utilities';
import { db } from '../../db';
import { GoKebabHorizontal as MenuIcon } from 'react-icons/go';
import { CheckIcon } from '@chakra-ui/icons';
import { MdEdit } from 'react-icons/md';

import Delete from './Delete';

export const listStringToId = (listString: string) => parseInt(listString.replace('list-', ''));
export const listIdToString = (listId: number) => `list-${listId}`;

export interface ColumnWrapperProps {
  children: React.ReactNode;
  styleProps: Object;
  innerRef?: React.RefObject<HTMLDivElement>;
  dataType?: string;
}

const ColumnWrapper: React.FC<ColumnWrapperProps> = ({ children, styleProps, innerRef, dataType }) => {
  dataType = dataType || '';
  return (
    <Stack
      mx={'4px'}
      // ref={innerRef}
      my={'2px'}
      flexShrink={0}
      borderRadius={'4px'}
      data-type={dataType}
      fontSize={'sm'}
      width={'250px'}
      pb={1}
      pt={0}
      px={0}
      {...styleProps}
    >
      {children}
    </Stack>
  );
}


export const CreateColumn: React.FC<{boardId: number; refreshData: Function;}> = ({ boardId, refreshData }) => {

  return (
    <ColumnWrapper
      styleProps={{
        mb: '3rem'
      }}>
      <Button
        bg={'gray.200'}
        _hover={{ opacity: 1 }}
        opacity={0.7}
        variant="outline"
        color={'black'}
        onClick={async () => {
          const columnName = window.prompt('Enter a column name:');
          if (columnName != null) {
            await db.addBoardList(columnName, boardId);
            refreshData();
          } else {
            console.log('cancelled');
          }
        }}
        textAlign={'left'}
        fontWeight={'regular'}
        display={'block'}>
        + Create Column
      </Button>
    </ColumnWrapper>
  );
}

// TODO: Add better ui to add story at the end of column
// TODO: Add better drag styling

export default function Column({ list, children, refreshData }: any) {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id: list.id,
  });
  const items = list.stories.map((item: any) => item.id);
  const isOverContainer = over
    ? (list.id === over.id && active?.data.current?.type !== "container") ||
      items.includes(over.id)
    : false;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const nameRef = useRef<HTMLInputElement>(null);
  const opacity = isDragging ? 0.5 : undefined;

  const changeName = async () => {
    await db.updateBoardList(listStringToId(list.id), {
      name: name,
    });
    refreshData();
    setEditing(false);
  }

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, [editing]);

  return (
    <Stack
      className={`column ${list.id}`}
      // background={'gray.200'}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        // backgroundColor: isOverContainer && "rgb(235, 235, 235, 1)",
        opacity
        // "--translatePanel-x": transform
        //   ? `${Math.round(transform.x)}px`
        //   : undefined,
        // "--translatePanel-y": transform
        //   ? `${Math.round(transform.y)}px`
        //   : undefined,
        // "--scalePanel-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
        // "--scalePanel-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
      }}
    >
      <ColumnWrapper
        styleProps={{
          // backgroundColor: isOverContainer ? 'red.200' : 'gray.200',
          backgroundColor: 'gray.200',
          opacity,
        }}
        dataType={'list'}>
      <HStack
        className={`column-header ${list.id}`}
        p={'0.1rem 0.5rem'}
        {...(editing ? {} : listeners)}
        {...(editing ? {} : attributes)}
        justifyContent={'space-between'}
      >
        {editing?
          <InputGroup>
          <Input
            defaultValue={name}
            onKeyUp={(e: any) => {
              if (e.key === 'Enter') {
                changeName();
              }
            }}
            onChange={(e) => setName(e.target.value)}
            ref={nameRef} />
          <InputRightElement
            onClick={changeName}
            cursor={'pointer'}
            children={<CheckIcon />}
          />
          </InputGroup>
          :
          <>
        <Heading
          as={'h3'}
          mb={'3px'}
          p={'4px'}
          cursor={'pointer'}
          fontWeight={'semibold'}
          flex={1}
          size={'sm'}>
          {list.name}
        </Heading>
        <Menu matchWidth={true}>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            color={'gray.500'}
            icon={<MenuIcon />}
            _hover={{
              backgroundColor: 'inherit',
              color: 'gray.800',
            }}
            _focus={{
              backgroundColor: 'inherit',
              color: 'gray.800',
            }}
            variant='outline'
          />
          <MenuList>
            <MenuItem icon={<MdEdit />} onClick={() => setEditing(true)}>
              Edit
            </MenuItem>
            <Delete id={listStringToId(list.id)} refreshData={refreshData} />
          </MenuList>
        </Menu>
          </>
        }
      </HStack>
        <Stack
          px={'7px'}
          spacing={'5px'}
          mb={'2px'}
        >
          {children}
        </Stack>
        <Flex
          px={'7px'}
          w={'100%'}
          className={`column-footer ${list.id}`}
        >
          <Button
            onClick={async () => {
              const storyTitle = window.prompt('Enter a story title:');
              if (storyTitle != null) {
                await db.addStory({
                  title: storyTitle,
                  listId: listStringToId(list.id),
                  boardId: list.boardId
                });
                refreshData();
              }
            }}
            bg={'gray.200'}
            _hover={{
              bg: 'gray.300',
            }}
            display={'block'}
            w={'100%'}
          >
            + Add Story
          </Button>
        </Flex>
      </ColumnWrapper>
    </Stack>
  );
}
