import {
  Flex,
  Stack,
  HStack,
  Textarea,
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
} from '@chakra-ui/react';
import { useSortable } from "@dnd-kit/sortable";
import { useState, useRef, useEffect } from 'react';
import {CSS} from '@dnd-kit/utilities';
import { db } from '../../db';
import { GoKebabHorizontal as MenuIcon } from 'react-icons/go';
import { CheckIcon, SmallCloseIcon, CloseIcon } from '@chakra-ui/icons';
import { MdEdit } from 'react-icons/md';

import Delete from './Delete';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export const listStringToId = (listString: string) => parseInt(listString.replace('list-', ''));
export const listIdToString = (listId: number) => `list-${listId}`;

// TODO: Don't allow empty string for new column title

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
  const [columnName, setColumnName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const submitHandler = async () => {
    await db.addBoardList(columnName, boardId);
    refreshData();
    setIsCreating(false);
    setColumnName('');
  }

  return (
    <ColumnWrapper
      styleProps={{
        mb: '3rem',
        mr: '3rem',
      }}>
      {!isCreating ?
        <Button
          bg={'gray.200'}
          _hover={{ opacity: 1 }}
          opacity={0.7}
          variant="outline"
          color={'black'}
          onClick={() => setIsCreating(true)}
          textAlign={'left'}
          fontWeight={'regular'}
          display={'block'}>
          + Create Column
        </Button> :
          <InputGroup>
            <Input
              placeholder="Enter a column name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onKeyPress={async (e) => {
                if (e.key === 'Enter') {
                  submitHandler();
                }
              }}
            />
            <HStack>
              <InputRightElement
              >
                <IconButton
                  variant="ghost"
                  aria-label="Add"
                  icon={<CheckIcon />}
                  size={'xs'}
                  onClick={submitHandler}
                />
                <IconButton
                  variant="ghost"
                  aria-label="Cancel"
                  mr={'5px'}
                  icon={<CloseIcon />}
                  size={'xs'}
                  onClick={() => {
                    setIsCreating(false);
                    setColumnName('');
                  }}
                />
              </InputRightElement>
            </HStack>
          </InputGroup>
      }

    </ColumnWrapper>
  );
}

export default function Column({ list, children, refreshData, isOverlay }: any) {
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
  const [addingStory, setAddingStory] = useState(false);
  const [newStory, setNewStory] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const newStoryRef = useRef<HTMLTextAreaElement>(null);
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

  useEffect(() => {
    if (newStoryRef.current) {
      newStoryRef.current.focus();
    }
  }, [addingStory]);

  return (
    <Stack
      className={`column ${list.id}`}
      ref={setNodeRef}
      style={{
        transition,
        transform: isOverlay ? 'translate(-7px, -4px) rotate(4deg)': '',
        opacity: isDragging ? 0.15 : 1,
        filter: isDragging ? 'saturate(5%) brightness(0%)' : '',
      }}
      transition={'all 0.1s ease-in-out'}
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
        <SimpleBar
          style={{
            height: '100%',
            width: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: '72vh',
          }}
          autoHide={false}
        >
          <Stack
            px={'7px'}
            pt={'2px'}
            spacing={'5px'}
            mb={'2px'}
            // border={'1px solid green'}
            maxHeight={'72vh'}
            //overflowY={'auto'}
          >
            {children}
          </Stack>
        </SimpleBar>
        <Flex
          px={'7px'}
          w={'100%'}
          className={`column-footer ${list.id}`}
        >
          {!addingStory ?
          <Button
            onClick={() => setAddingStory(true)}
            bg={'gray.200'}
            _hover={{
              bg: 'gray.300',
            }}
            display={'block'}
            w={'100%'}
          >
            + Add Story
          </Button>
          :
          <Flex
            position={'relative'}
          >
          <Textarea
            background={'#fff'}
            borderRadius={'2px'}
            placeholder={'Enter a story title'}
            ref={newStoryRef}
            p={1.5}
            minHeight={'4.5rem'}
            // replace trailing newlines
            value={newStory.replace(/^\n|\n$/g, '')}
            onChange={(e) => setNewStory(e.target.value)}
            onKeyUp={async (e) => {
              if (e.key === 'Enter' && newStory.trim()) {
                await db.addStory({
                  title: newStory,
                  listId: listStringToId(list.id),
                  boardId: list.boardId
                });
                setAddingStory(false);
                setNewStory('');
                refreshData();
              }
            }}
            mb={1.5}
          />
            <IconButton
              position={'absolute'}
              opacity={0.7}
              p={0}
              top={'0px'}
              right={'0px'}
              borderRadius={0}
              zIndex={'100'}
              aria-label='Cancel adding story'
              size={'xs'}
              onClick={() => {
                setNewStory('');
                setAddingStory(false);
              }}
              icon={<CloseIcon />}
            />
          </Flex>
          }
        </Flex>
      </ColumnWrapper>
    </Stack>
  );
}
