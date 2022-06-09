import { useSortable } from "@dnd-kit/sortable";
import {
  Flex,
  Text,
  Button,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {CSS} from '@dnd-kit/utilities';
import { db } from '../db';
import { StoryPreview } from '../types';
import { useRouter } from 'next/router';
import Link from 'next/link';

export interface CardProps {
  story: StoryPreview;
  isOverlay?: boolean;
  refreshData?: Function;
}

const Card: React.FC<CardProps> = ({
  story,
  isOverlay,
  refreshData
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

  const router = useRouter();
  const { orgname, boardId } = router.query;
  const storyURL = `/${orgname}/roadmap/${boardId}?story=${story.id}`;
  const opacity = isDragging ? 0.5 : 1;

  return (
    <Link href={storyURL}>
      <a
        onClick={() => {
          router.push(storyURL);
        }}
      >
    <Flex
      ref={setNodeRef}
      {...listeners}
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
        <Text
          onClick={isSorting ? undefined: () => window.alert(`clicked ${story.id}`)}
        >
          {story.title}
        </Text>
      </Flex>
    </Flex>
      </a>
    </Link>
  );
}

export default Card;
