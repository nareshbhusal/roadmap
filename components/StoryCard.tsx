import { useSortable } from "@dnd-kit/sortable";
import {
  Flex,
  Stack,
  HStack,
  Text,
  Button,
  Tag,
} from '@chakra-ui/react';

import {CSS} from '@dnd-kit/utilities';
import { useRef, useEffect } from 'react';
import { StoryPreview } from '../types';
import { StoriesTag } from '../types';

import { useRouter } from 'next/router';
import Link from 'next/link';
import Priority from './StoryPriority';
import { lightenColor } from '../lib/utils';

import { MdTaskAlt as TaskIcon, MdLightbulb as IdeaIcon } from 'react-icons/md';
import { BsTextLeft as DescriptionIcon } from 'react-icons/bs';

export interface CardProps {
  story: StoryPreview;
  isOverlay?: boolean;
  refreshData?: Function;
}

const CardDetails: React.FC<any> = ({ tasks, ideas, priority, description }) => {
  // Add indicators for description, tasks, ideas, priority
  return (
    <HStack
      spacing={'0.7rem'}
      fontSize={'xs'}
      color={'gray.600'}>
      {description?
        <DescriptionIcon />
        :
      null}
      {tasks.total ?
        <Flex
          border={'1px solid #ddd'}
          p={'0.1rem 0.3rem'}
          borderRadius={'7px'}
          color={'purple.700'}
          alignItems={'center'}
        >
          <Text mr={'3px'}>
            {tasks.done}/{tasks.total}
          </Text>
          <TaskIcon />
        </Flex>:
      null}
      {ideas.length ?
        <Flex
          border={'1px solid #ddd'}
          p={'0.1rem 0.3rem'}
          borderRadius={'7px'}
          color={'yellow.500'}
          alignItems={'center'}
        >
        <Text mr={'3px'}>
          {ideas.length}
        </Text>
          <IdeaIcon />
        </Flex>:
      null}
      <Priority priority={priority} />
    </HStack>
  );
}

const Tags: React.FC<any> = ({ tags }) => {
  if (tags.length === 0) {
    return null;
  }
  return (
    <Flex gap={'2px'} wrap={'wrap'}>
      {tags.map((tag: StoriesTag) => (
        <Tag
          key={tag.id}
          fontSize={'xs'}
          variant={'subtle'}
          mb={'2px'}
          borderRadius={'10px'}
          p={'0.2rem 0.5rem'}
          color={tag.color}
          backgroundColor={lightenColor(tag.color)}>
          {tag.text}
        </Tag>
      ))}
    </Flex>
  );
}

// BUG: Mobile issue:
// - Click on card not registering somehow, it seems to get swallowed up by dnd-kit or something

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

  const router = useRouter();
  const { orgname, boardId } = router.query;
  const storyURL = `/${orgname}/roadmap/${boardId}?story=${story.id}`;
  const cardLinkRef = useRef(null);

  return (
    <Link
      touch-action={'none'}
      href={storyURL}>
      <a
        touch-action={'none'}
        ref={cardLinkRef}
        onClick={() => {
          router.push(storyURL);
        }}
      >
        <Flex
          ref={setNodeRef}
          touch-action={'none'}
          {...listeners}
          borderRadius={'4px'}
          boxShadow={isOverlay ? 'lg' : 'sm'}
          border={`1px solid`}
          borderColor={'gray.200'}
          padding={1.5}
          fontSize={'sm'}
          className={`story story-${story.id} ${isOverlay ? 'story-overlay' : ''}`}
          background={'#fff'}
          transform={isOverlay ? 'translate(-7px, -4px) rotate(4deg)': ''}
          style={{
            transition,
            opacity: isDragging ? 0.05 : 1,
            filter: isDragging ? 'saturate(5%) brightness(0%)' : '',
            transform: CSS.Transform.toString(transform),
          }}
          transition={'all 0.1s ease-in-out'}
          _hover={{
            background: !isDragging && !isOverlay ? '#f1f3f5' : '#fff',
          }}
        >
          <Stack
            alignItems={'left'}
            justifyContent={'space-between'}
            width={'100%'}
            spacing={'0.65rem'}
          >
            <Tags tags={story.tags} />
            <Text>
              {story.title}
            </Text>
            <CardDetails
              tasks={story.tasks}
              priority={story.priority}
              description={story.description}
              ideas={story.ideas} />
          </Stack>
        </Flex>
      </a>
    </Link>
  );
}

export default Card;
