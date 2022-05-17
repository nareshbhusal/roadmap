import React from 'react';
import StoryCard from '../StoryCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import dynamic from 'next/dynamic';
import {
    Stack,
    Heading,
    Flex
} from '@chakra-ui/react';

export interface ColumnProps {
    column: any;
    index: number;
    tasks: any;
}

const Column: React.FC<ColumnProps> = (props: any) => {
    const backgroundColor = props.isDraggingOver ? '#d5f3ff' : 'inherit';

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
    const Draggable: any = dynamic(
        async () => {
            const mod = await import('react-beautiful-dnd');
            return mod.Draggable;
        },
        { ssr: false },
    );

    return (
        <Draggable
            draggableId={props.column.id} index={props.index}>
            {(provided: any) => (
                <Flex
                    margin={'1rem'}
                    border={'1px solid lightgrey'}
                    flexShrink={0}
                    borderRadius={'5px'}
                    width={'200px'}
                    flexDirection={'column'}
                    backgroundColor={'white'}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <Heading
                        as={'h3'}
                        textAlign={'center'}
                        size={'sm'}
                        {...provided.dragHandleProps}>
                        {props.column.title}
                    </Heading>
                    <Droppable droppableId={props.column.id} type='task'>
                        {(provided: any, snapshot: any) => (
                            <Stack
                                padding={'1em'}
                                backgroundColor={backgroundColor}
                                minHeight={'100px'}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                // isDraggingOver={snapshot.isDraggingOver}
                            >
                                {props.tasks.map((task: any, index: any) => <StoryCard key={task.id} task={task} index={index} />)}
                                {provided.placeholder}
                            </Stack>
                        )}
                    </Droppable>
                </Flex>

            )}
        </Draggable>
    )
}

export default Column;
