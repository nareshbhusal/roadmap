import {
  Flex,
  Text,
  HStack,
  Input,
  IconButton,
  Button,
  Checkbox,
} from '@chakra-ui/react';

import { useState, useRef, useEffect } from 'react';
import { Task as TaskType } from '../../../types';

import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import { db } from '../../../db';
import DragHandle from './DragHandle';
import { MdEdit } from 'react-icons/md';
import { FiDelete } from 'react-icons/fi';

export interface TaskProps {
  task: TaskType & { id: number; }
  isOverlay?: boolean;
}

const Task: React.FC<TaskProps> = ({ task, isOverlay }) => {
  const [editing, setEditing] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const deleteHandler = async () => {
    await db.removeTask(task.id);
  }

  const editHandler = async () => {
    if (inputRef.current) {
      const newTask = inputRef.current.value;
      await db.tasks.update(task.id, {
        name: newTask
      });
      setEditing(false);
    }
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useSortable({id: task.id});


  useEffect(() => {
    if (inputRef.current){
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <Flex
      key={task.id}
      ref={setNodeRef}
      border={'1px solid #ccc'}
      bg={'#fff'}
      p={0.5}
      style={{
        transition,
        boxShadow: isDragging? 'md' : '',
        opacity: isDragging ? 0.07 : 1,
        filter: isDragging ? 'saturate(10%) brightness(0%)' : '',
        transform: CSS.Transform.toString(transform),
      }}
      w={'100%'}
      minWidth={'270px'}
      justifyContent={'space-between'}>
      {editing?
        <Input
          ref={inputRef}
          size={'sm'}
          onBlur={editHandler}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              editHandler();
            }
          }}
          defaultValue={task.name} /> :
            <HStack
              alignItems={'center'}
            >
              <DragHandle
                listeners={listeners}
                attributes={attributes}
              />
              <Checkbox
                display={'flex'}
                isChecked={task.isCompleted}
                onChange={() => db.updateTask(task.id, { isCompleted: !task.isCompleted })}
              >
                <Text fontSize={'sm'}>{task.name}</Text>

              </Checkbox>
            </HStack>
      }
      {editing? null :
        <HStack
          spacing={'0.1rem'}
        >
          <IconButton
            aria-label="Edit"
            icon={<MdEdit />}
            isRound={true}
            onClick={() => {
              setEditing(true);
            }}
            color="gray.500"
            _hover={{
              color: 'blue.500',
            }}
            _focus={{
              color: 'blue.500',
            }}
            _active={{
              color: 'blue.500',
            }}
            variant="ghost"
            p={0.1}
            size="xs"
          />
          <IconButton
            aria-label={'Delete'}
            icon={<FiDelete />}
            onClick={deleteHandler}
            color="gray.500"
            _hover={{
              color: 'red.500',
            }}
            _focus={{
              color: 'red.500',
            }}
            _active={{
              color: 'red.500',
            }}
            isRound={true}
            variant="ghost"
            size="xs"
            p={0.1}
          />

        </HStack>
      }
    </Flex>
  );
}

export default Task;
