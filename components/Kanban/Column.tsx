import React from 'react';
import StoryCard from '../StoryCard';
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
                <Stack
                    mx={'4px'}
                    my={'2'}
                    border={'1px solid lightgrey'}
                    flexShrink={0}
                    borderRadius={'4px'}
                    fontSize={'sm'}
                    width={'200px'}
                    backgroundColor={'gray.200'}
                    py={1}
                    px={0}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <Heading
                        as={'h3'}
                        my={'3px'}
                        fontWeight={'semibold'}
                        textAlign={'center'}
                        size={'sm'}
                        {...provided.dragHandleProps}>
                        {props.column.title}
                    </Heading>
                    <Droppable droppableId={props.column.id} type='task'>
                        {(provided: any, snapshot: any) => (
                            <Stack
                                backgroundColor={backgroundColor}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                // isDraggingOver={snapshot.isDraggingOver}
                            >
                                <Stack
                                    px={'7px'}
                                    spacing={'5px'}
                                    minHeight={'200px'}
                                    mb={'3rem'}
                                >
                                    {props.tasks.map((task: any, index: any) => <StoryCard key={task.id} task={task} index={index} />)}
                                    {provided.placeholder}
                                </Stack>
                            </Stack>
                        )}
                    </Droppable>
                </Stack>

            )}
        </Draggable>
    )
}

export default Column;
