import React, { useRef, useState } from 'react';
import StoryCard, { setLastDraggingStory, getLastDraggingStory, resetLastDraggingStory,  } from '../StoryCard';
import { StoryDragItem, ListDragItem, ItemTypes } from './types';
import { StoryPreview, BoardList } from '../../types';
import { motion, AnimatePresence } from 'framer-motion'

import {
  Stack,
  Heading,
  Flex,
  Box,
  Button
} from '@chakra-ui/react';

import { db } from '../../db';
import { useDrop, useDrag } from "react-dnd";

export interface ColumnWrapperProps {
  children: React.ReactNode;
  styleProps: Object;
  innerRef?: React.RefObject<HTMLDivElement>;
  dataType?: string;
}

const MotionFlex = motion(Flex);

const ColumnWrapper: React.FC<ColumnWrapperProps> = ({ children, styleProps, innerRef, dataType }) => {
  dataType = dataType || '';
  return (
    <Stack
      mx={'4px'}
      ref={innerRef}
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

// TODO: Add animations
// TODO: Make list-on-list droppable area the whole list, not just the header
// TODO: Better style the story cards when dragging

export const CreateColumn: React.FC<{boardId: number}> = ({ boardId }) => {

  return (
    <ColumnWrapper
      styleProps={{
        mb: '3rem'
      }}>
      <Button
        bg={'gray.200'}
        _hover={{ opacity: 1 }}
        opacity={0.7}
        variant="outline"
        color={'black'}
        onClick={async () => {
          const columnName = window.prompt('Enter a column name:');
          if (columnName != null) {
            await db.addBoardList(columnName, boardId);
          } else {
            console.log('cancelled');
          }
        }}
        textAlign={'left'}
        fontWeight={'regular'}
        display={'block'}>
        + Create Column
      </Button>
    </ColumnWrapper>
  );
}

export interface ColumnProps {
  list: BoardList;
  boardId: number;
}

let lastDragListItem = {
  id: -11,
  position: -11,
}

export function getLastDraggingList() {
  return lastDragListItem;
}

export function setLastDraggingList(list: { id: number, position: number }) {
  lastDragListItem = JSON.parse(JSON.stringify({
    id: list.id,
    position: list.position
  }));
}

export function resetLastDraggingList() {
  setLastDraggingList({
    id: -11,
    position: -11
  });
}

// const isSameAsLastStoryItem = (item: StoryDragItem) => {
//   const lastDragStoryItem = getLastDraggingStory();
//   return lastDragStoryItem.id === item.id &&
//     lastDragStoryItem.position === item.position &&
//     lastDragStoryItem.listId === item.listId;
// }

const Column: React.FC<ColumnProps> = ({ list, boardId }) => {

  const dragRef = useRef<any>(null);
  const previewRef = useRef<any>(null);
  const footerRef = useRef<any>(null);
  const headerRef = useRef<any>(null);

  const [collectedProps, dropRef] = useDrop(() => ({
    accept: ItemTypes.STORY,
    hover: (item: StoryDragItem, monitor: any) => {

      const clientOffset = monitor.getClientOffset();

      const elementsUnderPointer = document.elementsFromPoint(clientOffset.x, clientOffset.y);
      const isHoveringOverStory = elementsUnderPointer
      .some((element: any) => element.dataset.type === 'story');
      if (isHoveringOverStory){
        return;
      }
      const isInFooterZone =  elementsUnderPointer
      .some((element: Element) => element === footerRef.current);
      const isInHeaderZone =  elementsUnderPointer
      .some((element: Element) => element === headerRef.current);

      // Looks like it's necessary for the mouse pointer to be hovering over a story to trigger moveStoryToStory,
      // so we're just going to check that it (story/item) simply isn't hovering over a story

      // HACK: To see if the last api call to move story is finished
      let lastDragStoryItem = getLastDraggingStory();
      if (item.id === lastDragStoryItem.id && item.position === lastDragStoryItem.position) {
        // waiting for last drag to finish
        return;
      }
      if (isInHeaderZone) {
        setLastDraggingStory(item);
        db.moveStoryToList(item.id, list.id, 'top').then(() => {
          resetLastDraggingStory();
        });
      } else if (isInFooterZone) {
        setLastDraggingStory(item);
        db.moveStoryToList(item.id, list.id, 'bottom').then(() => {
          resetLastDraggingStory();
        });
      }
      return;
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver({ shallow: true }),
      handlerId: monitor.getHandlerId()
    }),
  }));

  const [, listDropRef] = useDrop({
    accept: ItemTypes.LIST,
    hover: (item: ListDragItem, monitor: any) => {
      // see if the lists are different
      const mousePosition = monitor.getClientOffset();
      const hoverBoundingRect = dragRef.current.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverClientX = hoverBoundingRect.right - mousePosition.x;
      // if (list.position > item.position && hoverMiddleX < hoverClientX) {
      //   return;
      // }
      // if (list.position < item.position && hoverMiddleX > hoverClientX) {
      //   return;
      // }
      const differenceInX = Math.abs(Math.abs(hoverClientX) - Math.abs(hoverMiddleX));
      // console.log(`difference in y: ${differenceInY}`);
      // if ((differenceInX < 15 && item.position > list.position) || item.position < list.position) {
      //   return;
      // }

      let lastDragListItem = getLastDraggingList();
      if (item.id !== list.id) {
        if (lastDragListItem.id === item.id && lastDragListItem.position === item.position) {
          // console.log(`waiting for last drag to finish`);
        } else {
          setLastDraggingList(item);
          db.moveBoardList(item.id, list.id).then(() => {
            resetLastDraggingList();
          });
        }
      }
    }
  });


  const [collected, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.LIST,
    item: {
      name: list.name,
      id: list.id,
      position: list.position
    },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
      monitoredItem: monitor.getItem()
    }),
    options: {
      dropEffect: 'move',
    },
  }));

  const { isDragging } = collected as any;

  drag(listDropRef(dragRef));
  dropRef(dragPreview(previewRef))
  const opacity = isDragging ? 0.4 : 1;

  return (
    <MotionFlex
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      // layout
    >
      <ColumnWrapper
        styleProps={{
          backgroundColor:'gray.200',
          opacity,
          // border: '1px solid orange',
        }}
        dataType={'list'}
        innerRef={previewRef}
      >
        <Box ref={headerRef}>
          <Heading
            as={'h3'}
            mb={'3px'}
            p={'4px'}
            ref={dragRef}
            cursor={'pointer'}
            fontWeight={'semibold'}
            textAlign={'center'}
            size={'sm'}>
            {list.name}
          </Heading>
        </Box>
        <Stack
        >
          <Stack
            ref={dropRef}
            // minHeight={'200px'}
          >
            <Stack
              overflowX={'auto'}
              // backgroundColor={'gray'}
            >
              <Stack
                px={'7px'}
                spacing={'5px'}
                mb={'2px'}
              >
                <AnimatePresence>
                  {list.stories.sort((a: StoryPreview, b: StoryPreview) => a.position - b.position).map(
                    (story: StoryPreview, index: number) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        index={index} />
                    ))}
                </AnimatePresence>
              </Stack>
            </Stack>
          </Stack>
          <Flex
            px={'7px'}
            ref={footerRef}
            w={'100%'}
          >
            <Button
              onClick={async () => {
                const storyTitle = window.prompt('Enter a story title:');
                if (storyTitle != null) {
                  await db.addStory({
                    title: storyTitle,
                    listId: list.id,
                    boardId: boardId
                  });
                }
              }}
              bg={'gray.200'}
              _hover={{
                bg: 'gray.300',
              }}
              display={'block'}
              w={'100%'}
            >
              + Add Story
            </Button>
          </Flex>
        </Stack>
      </ColumnWrapper>
    </MotionFlex>
  );
}

export default Column;
