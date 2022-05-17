import { useState } from 'react';
import {
    Stack,
    Text,
    Flex
} from '@chakra-ui/react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import Column from './Column';

export interface KanbanProps {
  dataset: any;
}

const Kanban: React.FC<KanbanProps> = ({ dataset }) => {
  const [data, setData] = useState(dataset)

  const DragDropContext: any = dynamic(
    async () => {
      const mod = await import('react-beautiful-dnd');
      return mod.DragDropContext;
    },
    { ssr: false },
  );

  const Droppable: any = dynamic(
    async () => {
      const mod = await import('react-beautiful-dnd');
      return mod.Droppable;
    },
    { ssr: false },
  );

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result;
    //If there is no destination
    if (!destination) { return }

    //If source and destination is the same
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return }

    //If you're dragging columns
    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      const newState = {
        ...data,
        columnOrder: newColumnOrder
      }
      setData(newState)
      return;
    }

    //Anything below this happens if you're dragging tasks
    const start = (data.columns as any)[source.droppableId];
    const finish = (data.columns as any)[destination.droppableId];

    //If dropped inside the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }
      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      }
      setData(newState)
      return;
    }

    //If dropped in a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    }

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }

    setData(newState)
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}>
      <Droppable droppableId='all-columns' direction='horizontal' type='column'>
        {(provided: any) => (
          <Flex
            // height={'400px'}
            overflowX={'auto'}
            flexGrow={'1'}
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {data.columnOrder.map((id: any, index: any) => {
              const column = (data.columns as any)[id]
              const tasks = column.taskIds.map((taskId: any) => (data.tasks as any)[taskId])

              return <Column key={column.id} column={column} tasks={tasks} index={index} />
            })}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </DragDropContext>
  );
}


export default Kanban;
