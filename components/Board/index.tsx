import { useState } from 'react';
import { createPortal } from "react-dom";
import { BoardData, StoryPreview, BoardList } from '../../types';
import { getDistanceBetweenElements } from '../../lib/utils';
import {
  Flex,
} from '@chakra-ui/react';

import Column, { CreateColumn, listStringToId } from '../Column';
import StoryCard from '../StoryCard';

import { db } from '../../db';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimation,
  UniqueIdentifier,
  DropAnimation,
  DragOverlay,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';

export interface ActiveDragItem {
  id: UniqueIdentifier;
  type: 'list' | 'story';
};

const Board: React.FC<{ boardData: any; refreshData: Function; }> = ({ boardData, refreshData }) => {

  const [activeDragItem, setActiveDragItem] = useState<null | ActiveDragItem>(null);
  const [canMove, setCanMove] = useState<boolean>(true);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const findContainer = (id: UniqueIdentifier) => {
    const preResult = boardData.lists.find((list: BoardList) => {
      return list.stories.find((item: StoryPreview) => {
        return item.id === id;
      });
    });

    if (preResult) {
      return preResult;
    } else {
      return boardData.lists.find((list: BoardList) => {
        return list.id === id;
      });
    }
  }

  const renderContainerDragOverlay = (id: UniqueIdentifier) => {
    const list = boardData.lists.find((list: BoardList) => {
      return list.id === id;
    })!;
    return (
      <Column key={list.id} list={list}>
        {list.stories.sort((a: StoryPreview, b: StoryPreview) => a.position - b.position)
          .map((story: StoryPreview) => (
            <StoryCard
              key={story.id}
              story={story}
            />
          ))}
      </Column>
    );
  }

  const renderSortableItemDragOverlay = (id: UniqueIdentifier) => {
    const story = boardData.lists.find((list: BoardList) => {
      return list.stories.find((item: StoryPreview) => {
        return item.id === id;
      });
    })!.stories.find((item: StoryPreview) => {
      return item.id === id;
    });

    return (
      <StoryCard
        isOverlay={true}
        story={story}
      />
    );
  }

  const dragHandler = (
    { active, over, handler }:
      { active: any; over: any; handler: 'onDragEnd' | 'onDragOver'}) => {

    if (!over) return;

    const overType = over!.data.current!.sortable.containerId;

    if (!canMove) return;
    if (activeDragItem!.type === overType && activeDragItem!.id === over!.id) return;
    if (activeDragItem!.type === 'list' && overType === 'story') return;

    const shouldBeRunByOnDragOver = () => {
      if (activeDragItem!.type === 'story' && overType === 'story') {
        const isListSame = findContainer(activeDragItem!.id)!.id === findContainer(over.id)!.id;
        if (isListSame) {
            return false;
        }
      }
      return true;
    }

    if ((shouldBeRunByOnDragOver() && handler === 'onDragOver') ||
        (!shouldBeRunByOnDragOver() && handler === 'onDragEnd')) {
    } else return;

    // to prevent these set of db calls if the last call of the kind hasn't finished yet
    // we're limiting the drags to one request per backend at a time, not ideal but it's ok for now
    setCanMove(false);
    if (activeDragItem!.type === 'story' && overType === 'story') {

      if (handler === 'onDragEnd') {
        // Calculate and update board state locally to prevent render issues while
        // the data from db gets refetched
        // -- all of this is done when both stories are on the same list
        // -- - db calls run only on onDragEnd not onDragOver
        let updatedList = findContainer(activeDragItem!.id)!;
        const draggingStory = updatedList.stories.find((story: StoryPreview) => {
          return story.id === activeDragItem!.id;
        })!;
        const overStory = updatedList.stories.find((story: StoryPreview) => {
          return story.id === over.id;
        })!;

        const currentPosition = draggingStory.position;
        const destinationPosition = overStory.position;
        if (currentPosition === destinationPosition) return;

        if (currentPosition < destinationPosition) {
          updatedList.stories = updatedList.stories.map((story: StoryPreview) => {
            if (story.position > currentPosition && story.position <= destinationPosition) {
              story.position -= 1;
            }
            return story;
          });
        } else {
          updatedList.stories = updatedList.stories.map((story: StoryPreview) => {
            if (story.position >= destinationPosition && story.position < currentPosition) {
              story.position += 1;
            }
            return story;
          });
        }

        draggingStory.position = destinationPosition;
        boardData.lists = boardData.lists.map((list: BoardList) => {
          if (list.id === updatedList.id) {
            return updatedList;
          }
          return list;
        });
      }

      db.moveStoryToStory(active!.id as number, over!.id as number).then(() => {
        setCanMove(true);
        refreshData();
      });

    } else if (activeDragItem!.type === 'story' && overType === 'list') {
      const headerElement = document.querySelector(`.${over.id} .column-header`) as HTMLElement;
      const footerElement = document.querySelector(`.${over.id} .column-footer`) as HTMLElement;
      const dragElement = document.querySelector('.story-overlay') as HTMLElement;
      let direction: 'top' | 'bottom' = 'bottom';

      if (getDistanceBetweenElements(dragElement, headerElement) <
          getDistanceBetweenElements(dragElement, footerElement))
        {
          direction = 'top';
        } else {
          direction = 'bottom';
        }

        const listId = listStringToId(over!.id as string);
        db.moveStoryToList(activeDragItem!.id as number, listId, direction).then(() => {
          setCanMove(true);
          refreshData();
        });
    } else {
      const listToMove = listStringToId(activeDragItem!.id as string);
      const listToMoveTo = listStringToId(over!.id as string);
      db.moveBoardList(listToMove, listToMoveTo).then(() => {
        setCanMove(true);
        refreshData();
      });
    }
    if(handler === 'onDragEnd') {
      setActiveDragItem(null);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => {
        const { active } = event;
        const type = active.data.current!.sortable.containerId;
        setActiveDragItem({
          type,
          id: active.id,
        });
      }}
      onDragEnd={(event) =>
        dragHandler({ ...event, handler: 'onDragEnd' })
      }
      onDragCancel={onDragCancel}
      onDragOver={(event) =>
        dragHandler({ ...event, handler: 'onDragOver' })
      }
    >
      <Flex
        height={'100%'}
      >
        <SortableContext
          id={'list'}
          items={[...boardData.lists
            .sort((a: BoardList, b: BoardList) => a.position - b.position)
            .map((list: BoardList) => list.id)]}
          strategy={horizontalListSortingStrategy}
        >
          <Flex
            height={'100%'}
            width={'100%'}
          >
            <Flex
              border={'1px solid #ccc'}
              backgroundColor={'gray.600'}
              alignItems= {'flex-start'}
              flexGrow={'1'}
              py={'15px'}
              // minHeight={'300px'}
              height={'100%'}
              overflowX={'auto'}
            >
              {boardData.lists.sort((a: BoardList, b: BoardList) => a.position - b.position)
                .map((list: BoardList) => (
                  <Column
                    key={list.id}
                    list={list}
                    refreshData={refreshData}
                  >
                    <SortableContext
                      id={'story'}
                      items={[...list.stories
                        .sort((a: StoryPreview, b: StoryPreview) => a.position - b.position)
                        .map((story: StoryPreview) => story.id)]}
                      strategy={verticalListSortingStrategy}
                    >
                      {boardData.lists
                        .find((l: BoardList) => l.id === list.id)!.stories.map(
                          (story: StoryPreview) => (
                            <StoryCard
                              refreshData={refreshData}
                              key={story.id}
                              story={story}
                            />
                          )
                        )}
                    </SortableContext>
                  </Column>
                ))}
              <CreateColumn refreshData={refreshData} boardId={boardData.id} />
            </Flex>
          </Flex>
        </SortableContext>
      </Flex>
      {createPortal(
        <DragOverlay
          adjustScale={false}
          dropAnimation={{
            ...defaultDropAnimation,
          }}
        >
          {activeDragItem && activeDragItem.type === 'list' && renderContainerDragOverlay(activeDragItem.id)}
          {activeDragItem && activeDragItem.type === 'story' && renderSortableItemDragOverlay(activeDragItem.id)}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );

  function handleDragEnd({ active, over }: any) {
    const activeContainer = findContainer(active.id);
    // following line causes some funny behavior
    // -- not replicable now in the future
    setActiveDragItem(null);
  }

  function onDragCancel() {
    setActiveDragItem(null);
  }
}

export default Board;
