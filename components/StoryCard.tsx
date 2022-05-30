import React, { useRef } from 'react'
import { Flex, Text, Button } from '@chakra-ui/react';
import { db } from '../db';
import { useDrop, useDrag } from "react-dnd";
import { StoryPreview } from '../types';
import { ItemTypes, StoryDragItem } from './Kanban/types';
import { motion } from 'framer-motion';

const MotionFlex = motion(Flex);

// TODO: What about listId
// -- like, it could be that id and position are the same, but they're on different lists
let lastDraggingStory = {
  id: -11,
  position: -11,
  // listId: -11,
};

export function getLastDraggingStory() {
  return lastDraggingStory;
}

export function setLastDraggingStory(story: { id: number, position: number; listId?: number }) {
  lastDraggingStory = JSON.parse(JSON.stringify({
    id: story.id,
    position: story.position,
    listId: story.listId
  }));
}
// BUG: isDragging is false once the story is dragging over to another list --
// https://www.google.com/search?q=react-dnd+isDragging+false

export function resetLastDraggingStory() {
  setLastDraggingStory({
    id: -11,
    position: -11,
    // listId: -11,
  });
}

export interface StoryCardProps {
  story: StoryPreview;
  index: number;
}


const StoryCard: React.FC<StoryCardProps> = ({ story }) => {

  const ref = useRef(null);

  const [collected, dragRef, dragPreview] = useDrag(() => ({
    type: ItemTypes.STORY,
    item: {
      title: story.title,
      id: story.id,
      listId: story.listId,
      position: story.position,
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [story]);

  const [, dropRef] = useDrop({
    accept: ItemTypes.STORY,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: any, monitor: any) {
      if (!ref.current) {
        return;
      }
      const draggingStory = item;
      const draggedOverStory = story;
      // Don't replace items with themselves
      if (draggingStory.id === draggedOverStory.id) {
        // console.log('dragging story is the same as the dragged over story');
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = (ref.current as any)?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const mousePosition = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = mousePosition.y - hoverBoundingRect.top;

      // TODO: Have better logic than this, it's like the cards hesitate to actually move directions

      // Dragging downwards
      if (draggingStory.position < draggedOverStory.position && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (draggingStory.position > draggedOverStory.position && hoverClientY > hoverMiddleY) {
        return;
      }
      // What the hell is happening to the state inside the hover
      // console.log(`hoverClientY: ${hoverClientY}`);
      // console.log(`hoverMiddleY: ${hoverMiddleY}`);
      const differenceInY = Math.abs(Math.abs(hoverClientY) - Math.abs(hoverMiddleY));
      // console.log(`difference in y: ${differenceInY}`);
      if (differenceInY < 5) {
        return;
      }
      // HACK: To see if the last api call to move story is finished
      let lastDraggingStory = getLastDraggingStory();
      if (lastDraggingStory.id === draggingStory.id && lastDraggingStory.position === draggingStory.position) {
        // waiting for last move card api call to finish
        return;
      }
      // console.log(`${draggingStory.title}(${draggingStory.position}) over ${draggedOverStory.title}(${draggedOverStory.position})`);
      setLastDraggingStory(draggingStory);
      db.moveStoryToStory(draggingStory.id, draggedOverStory.id)
      .then(() => {
        resetLastDraggingStory();
        console.log(item.position, story.position, draggedOverStory.position);
        // console.log(item.id, story.id, draggedOverStory.id);
        // item.position = draggedOverStory.position;
        // item.id = draggedOverStory.id;
        // console.log('moved');
        // console.log(`${draggedOverStory.title} is now at position ${draggedOverStory.position}`);
        // console.log(item.position, draggingStory.position)
      });
    },
  }, [story]);

  const { isDragging } = collected;
  // console.log(isDragging)
  dragRef(dropRef(ref));
  const opacity = isDragging ? 0.4 : 1;

  return (
    <MotionFlex
      border={`1px solid #ccc`}
      padding={1.5}
      ref={ref}
      data-type={'story'}
      borderRadius={'4px'}
      fontSize={'sm'}
      background={'#fff'}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      // layout
    >
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Text>
          {story.title}
        </Text>
        <Button
          background={'red.300'}
          color={'gray.100'}
          onClick={() => {
            if (window.confirm(`Delete story with id: ${story.id}?`)) {
              db.removeStory(story.id);
            }
          }}
          _hover={{
            bg: 'red',
            color: '#fff'
          }}
        >
          X
        </Button>
      </Flex>
    </MotionFlex>
  );
}


export default StoryCard;
