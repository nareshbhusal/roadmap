import React from 'react'
// import { Draggable } from 'react-beautiful-dnd'
import { Flex, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

function Task(props: any) {

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
        <Draggable draggableId={props.task.id} index={props.index}>
            {(provided: any, snapshot: any) => (
                <Flex
                    border={`1px solid #ccc`}
                    padding={1.5}
                    borderRadius={'4px'}
                    fontSize={'sm'}
                    // _last={{ marginBottom: '3rem' }}
                    background={'#fff'}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    // isDragging={snapshot.isDragging}
                >
                    <Text>
                        {props.task.content}
                    </Text>
                </Flex>
            )}
        </Draggable>
    )
}

export default Task
