import {
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  HStack,
  Input,
  Button,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

import { useState, useRef } from 'react';

import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import { db } from '../../../db';
import DragHandle from './DragHandle';

const Task: React.FC<{task: any}> = ({ task }) => {
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
    transition,
  } = useSortable({id: task.id});


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Flex
      key={task.id}
      ref={setNodeRef}
      style={style}
      border={'1px solid #ccc'}
      bg={'#fff'}
      p={0.5}
      w={'100%'}
      justifyContent={'space-between'}
      marginBottom={'5px'}>
      {editing?
        <Input
          ref={inputRef}
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
                {task.name}
              </Checkbox>
            </HStack>
      }
      {editing? null :
        <HStack
          spacing={'0.2rem'}
        >
          <Button
            onClick={deleteHandler}
            color="red"
            variant="ghost"
            size="sm"
            p={0.5}
            rightIcon={<DeleteIcon />}
          />

          <Button
            onClick={() => {
              setEditing(true)
              if (inputRef.current){
                inputRef.current.focus();
              }
            }}
            color="blue"
            variant="ghost"
            p={0.5}
            size="sm"
            ml={'auto'}
            rightIcon={<EditIcon />}
          />
        </HStack>
      }
    </Flex>
  );
}

export default Task;
