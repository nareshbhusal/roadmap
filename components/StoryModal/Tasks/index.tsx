import { useEffect } from 'react';
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
import { EditIcon, DeleteIcon, PlusSquareIcon, SmallCloseIcon, CheckIcon } from '@chakra-ui/icons';
import { Task as TaskType } from '../../../types';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { db } from '../../../db';
import { useState, useRef } from 'react';
import Task from './Task';

// TODO: Input elements not receiving focus
// TODO: Add DragOverlay

const Tasks: React.FC<{ storyID: number; tasks: TaskType[] }> = ({ storyID, tasks }) => {
  // tasks is a list of tasks objects that have a property called 'id' and 'name' and 'isCompleted', and position
  // render a list of tasks as checklists that can be completed or not completed
  const [newTaskOpen, setNewTaskOpen] = useState<boolean>(false);
  const newTaskRef = useRef<HTMLInputElement>(null);

  const addTask = async () => {
    if (newTaskRef.current?.value) {
      await db.addTask(storyID, newTaskRef.current.value);
      setNewTaskOpen(false);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  let lastDragProcessed = true;
  const handleDragEnd = async ({ active, over }: any) => {
    // BUG:: running this on onDragOver doesn't work as intended,
    // likely because of all the requests that have to be processed for all
    // the dragovers that take place between the start and the destination positions
    // -- Passing to onDragEnd works except the rendering is funny as the item first
    // goes back to where it came from, and then goes to the destination after the request is processed
    // and new data comes in
    if (lastDragProcessed){
      lastDragProcessed = false;
      await db.moveTask(active.id, over.id);
      lastDragProcessed = true;
    } else {
      console.log('==waiting==')
    }
  }

  const sortedTaskList = tasks.sort((a: TaskType, b: TaskType) => a.position - b.position);

  return (
    <Stack
      spacing={'10px'}
    >
      <Heading
        fontWeight={'semibold'}
        fontSize={'15px'}>
        Tasks
      </Heading>
      <Flex
        marginTop={'10px'}>
        <Flex
          flexDirection={'column'}
          width={'auto'}
          minWidth={'60%'}
          justifyContent={'flex-left'}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedTaskList
                .map(task => task.id!)}
              strategy={verticalListSortingStrategy}
            >
              {sortedTaskList
                .map((task: TaskType) => <Task key={task.id} task={task} />)}
            </SortableContext>
          </DndContext>
          {newTaskOpen?
            <Flex
              alignItems={'center'}
              justifyContent={'center'}>
              <Input
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    addTask();
                  }
                }}
                ref={newTaskRef}
                placeholder={'New task'} />
              <HStack spacing={'0.2rem'}>
                <Button
                  onClick={() => setNewTaskOpen(false)}
                  color="grey"
                  variant="ghost"
                  size="sm"
                  p={0.5}
                  rightIcon={<SmallCloseIcon />}
                />
                <Button
                  onClick={addTask}
                  color="grey"
                  variant="ghost"
                  size="sm"
                  p={0.5}
                  rightIcon={<CheckIcon/>}
                />
              </HStack>
            </Flex> :
            <Button
              onClick={() => {
                setNewTaskOpen(true);
                if (newTaskRef.current){
                  newTaskRef.current.focus();
                }
              }}
              color="blue"
              variant="ghost"
              p={0.25}
              size="sm"
              width={'auto'}
              rightIcon={<PlusSquareIcon />}
            />
          }
        </Flex>
      </Flex>
    </Stack>
  );
}

export default Tasks;
