import { useEffect } from 'react';
import { createPortal } from "react-dom";
import {
  Stack,
  Flex,
  Heading,
  Text,
  HStack,
  Input,
  IconButton
} from '@chakra-ui/react';
import { Task as TaskType } from '../../../types';

import {
  DndContext,
  closestCenter,
  defaultDropAnimation,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { db } from '../../../db';
import { useState, useRef } from 'react';
import Task from './Task';

import { GrFormClose } from 'react-icons/gr';
import { MdCheck, MdAddBox } from 'react-icons/md';

const Tasks: React.FC<{ storyID: number; tasks: TaskType[] }> = ({ storyID, tasks }) => {

  const [newTaskOpen, setNewTaskOpen] = useState<boolean>(false);
  const newTaskRef = useRef<HTMLInputElement>(null);
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);

  const addTask = async () => {
    if (newTaskRef.current?.value) {
      await db.addTask(storyID, newTaskRef.current.value);
      setNewTaskOpen(false);
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(PointerSensor),
  );

  const renderSortableCardDragOverlay = (dragId: UniqueIdentifier) => {
    return (
      <Task
        isOverlay={true}
        task={tasks.find(task => task.id == dragId) as any} />
    );
  }

  let lastDragProcessed = true;
  const handleDragEnd = async ({ active, over }: any) => {
    if (!lastDragProcessed) return;

    // modify local state
    const draggingTask = tasks.find(task => task.id === active.id);
    const overTask = tasks.find(task => task.id === over.id);
    if (!draggingTask || !overTask) return;
    if (draggingTask.id === overTask.id) return;

    const currentPosition = draggingTask.position;
    const destinationPosition = overTask.position;
    if (currentPosition === destinationPosition) return;

    lastDragProcessed = false;

    let updatedTasks = tasks;

    if (currentPosition < destinationPosition) {
      updatedTasks = updatedTasks.map((task: any) => {
        if (task.position > currentPosition && task.position <= destinationPosition) {
          task.position -= 1;
        }
        return task;
      });
    } else {
      updatedTasks = updatedTasks.map((task: any) => {
        if (task.position >= destinationPosition && task.position < currentPosition) {
          task.position += 1;
        }
        return task;
      });
    }

    updatedTasks.find(task => task.id === draggingTask.id)!.position = destinationPosition;
    tasks = [...updatedTasks];
    // console.log('client updated tasks');
    // console.log(tasks);

    await db.moveTask(active.id, over.id);
    lastDragProcessed = true;
  }

  const sortedTaskList = tasks.sort((a: TaskType, b: TaskType) => a.position - b.position);

  useEffect(() => {
    if (newTaskRef.current){
      newTaskRef.current.focus();
    }
  }, [newTaskOpen]);

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
            onDragStart={({ active }) => {
              setActiveDragId(active.id);
            }}
            onDragCancel={() => {
              setActiveDragId(null);
            }}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks
                .sort((a, b) => a.position - b.position)
                .map(task => task.id!)}
              strategy={verticalListSortingStrategy}
            >
              <Stack
                spacing={'2px'}>
                {tasks
                  .sort((a, b) => a.position - b.position)
                  .map((task: TaskType) =>
                    <Task
                      key={task.id}
                      task={task as TaskType & { id: number }} />
                      )}
              </Stack>
            </SortableContext>
            <DragOverlay
              adjustScale={false}
              dropAnimation={{
                ...defaultDropAnimation,
              }}
            >
              {activeDragId && renderSortableCardDragOverlay(activeDragId)}
            </DragOverlay>
          </DndContext>

          {tasks.length === 0 ?
            <Text
              color={'gray.600'}
              fontSize={'xs'}
              marginTop={'10px'}>
              No tasks added yet
            </Text>
            : null}

          {newTaskOpen?
            <Flex
              alignItems={'center'}
              justifyContent={'center'}>
              <Input
                size={'sm'}
                ref={newTaskRef}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    addTask();
                  }
                }}
                placeholder={'New task'} />
              <HStack spacing={'0.1rem'}>
                <IconButton
                  aria-label={'cancel'}
                  onClick={() => setNewTaskOpen(false)}
                  icon={<GrFormClose />}
                  color="grey"
                  variant="ghost"
                  isRound={true}
                  size="sm"
                  p={0.1}
                />
                <IconButton
                  aria-label={'add task'}
                  onClick={addTask}
                  icon={<MdCheck />}
                  color="grey"
                  variant="ghost"
                  size="sm"
                  isRound={true}
                  p={0.1}
                />
              </HStack>
            </Flex> :
            <IconButton
              aria-label={'create task'}
              icon={<MdAddBox />}
              onClick={() => {
                setNewTaskOpen(true);
              }}
              color="blue"
              alignSelf={'flex-start'}
              variant="ghost"
              p={0}
              size="md"
              width={'auto'}
            />
          }
        </Flex>
      </Flex>
    </Stack>
  );
}

export default Tasks;
