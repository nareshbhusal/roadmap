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

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller, useFieldArray } from "react-hook-form";

import NextLink from 'next/link';
import { db } from '../../db';
import { useLiveQuery } from "dexie-react-hooks";
import { ActionMeta, OnChangeValue } from 'react-select';
import { default as ReactSelect } from 'react-select';

import Tags from './Tags';
import Ideas from './Ideas';
import Tasks from './Tasks';
import Priority from './Priority';
import Description from './Description';
import Delete from './Delete';

const StoryModal: React.FC<{id: number; refreshData: Function;}> = ({ id, refreshData}) => {
  const router = useRouter();
  const { orgname, boardId } = router.query;

  const story = useLiveQuery(
    () =>
      db.getStory(id)
  );

  const updateTitle = (e: any) => {
    db.updateStory(id, { title: e.target.innerText });
  };
  const updateDescription = (e: any) => {
    db.updateStory(id, { description: e.target.innerHTML });
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
              flexDirection={'row'}
            >
              <Stack
                p={4}
                w={'100%'}
                flexBasis={'70%'}
                spacing={6}
              >
                <ModalHeader
                  p={1}
                  onBlur={updateTitle}
                  suppressContentEditableWarning={true}
                  borderRadius={'md'}
                  transitionDuration={'0.2s'}
                  _focus={{
                    outline:'2px solid blue'
                  }}
                  contentEditable={true}>
                  {story.title}
                </ModalHeader>
                <Tags storyID={id} boardId={Number(boardId)} tags={story.tags}/>
                <Description updateHandler={updateDescription} description={story.description!}/>
                <Tasks tasks={story.tasks}/>
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
                <Priority id={story.id!} priority={parseInt(story.priority!)} />

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
