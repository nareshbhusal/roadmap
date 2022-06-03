import { useSortable } from "@dnd-kit/sortable";
import {
  Flex,
  Text,
  Button
} from '@chakra-ui/react';
import {CSS} from '@dnd-kit/utilities';
import { db } from '../db';
import { StoryPreview } from '../types';

export interface CardProps {
  story: StoryPreview;
  isOverlay?: boolean;
}

const Card: React.FC<CardProps> = ({
  story,
  isOverlay
}) => {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id: story.id,
  });

  // console.log("card: ", over?.id);

  const opacity = isDragging ? 0.5 : 1;

  return (
    <Flex
      {...listeners}
      ref={setNodeRef}
      borderRadius={'4px'}
      opacity={opacity}
      border={`1px solid #ccc`}
      padding={1.5}
      fontSize={'sm'}
      className={`story-${story.id} ${isOverlay ? 'story-overlay' : ''}`}
      background={'#fff'}
      style={{
        // ...wrapperStyle,
        transition,
        transform: CSS.Transform.toString(transform),
      }}
    >
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        width={'100%'}
        style={{
          // @ts-ignore
          // value: cardIndex,
          // isDragging,
          // isSorting,
          // overIndex: over ? getIndex(over.id) : overIndex,
          // panelId,
        }}
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
    </Flex>
  );
}

export default Card;
