import {
  Flex,
  Text,
  Button,
  Stack,
  Heading,
  Box,
  Badge,
  Checkbox,
  CheckboxGroup,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import React from 'react';
import { useRouter } from 'next/router';

import NextLink from 'next/link';
import { db } from '../../db';
import { useLiveQuery } from "dexie-react-hooks";

import Tags from './Tags/';
import Ideas from './Ideas';
import Tasks from './Tasks';
import Priority from './Priority';
import Description from './Description';
import Delete from './Delete';

import { PriorityValue, StoriesTag } from '../../types';

const StoryModal: React.FC<{id: number; refreshData: Function; tags: StoriesTag[]}> = ({ id, refreshData, tags}) => {
  const router = useRouter();
  const { orgname, boardId } = router.query;

  const story = useLiveQuery(
    () =>
      db.getStory(id)
  );

  const updateTitle = async (e: any) => {
    await db.updateStory(id, { title: e.target.innerText.trim() });
  };
  const updateDescription = async (e: any) => {
    await db.updateStory(id, { description: e.target.innerHTML });
  }

  return (
    <Modal
      // TODO: size should be 4xl for anything less than lg, and 3xl for anything more than lg
      size={'4xl'}
      isOpen={true}
      onClose={() => {
        router.push(`/${orgname}/roadmap/${boardId}`)
        refreshData();
      }}>
      {story ?
        <>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody
              display={'flex'}
              flex={1}
              // if size is md or lower, flexDirection should be column, else row
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Stack
                p={1.5}
                w={'100%'}
                flexBasis={'70%'}
                spacing={6}
              >
                <ModalHeader
                  p={1}
                  onBlur={updateTitle}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      updateTitle(e);
                    }
                  }}
                  suppressContentEditableWarning={true}
                  borderRadius={'md'}
                  transitionDuration={'0.2s'}
                  _focus={{
                    outline:'2px solid blue'
                  }}
                  contentEditable={true}>
                  {story.title}
                </ModalHeader>

                <Tags storyID={id} allTags={tags} tags={story.tags}/>

                <Description updateHandler={updateDescription} description={story.description!}/>
                <Tasks storyID={id} tasks={story.tasks}/>
                <Ideas ideas={story.ideas}/>
              </Stack>
              <Stack
                w={'100%'}
                flexBasis={'30%'}
                marginTop={'20px'}
                spacing={6}
                p={4}
              >
                <Delete refreshData={refreshData} />
                <Priority
                  id={story.id!}
                  priority={Number(story.priority!) as PriorityValue} />

              </Stack>
            </ModalBody>
          </ModalContent>
        </>:
        <Text>Loading...</Text>
      }
    </Modal>
  );
};

export default StoryModal;
