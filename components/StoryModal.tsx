import {
  Flex,
  Text,
  Button,
  Stack,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller, useFieldArray } from "react-hook-form";

import NextLink from 'next/link';
import { db } from '../db';
import { useLiveQuery } from "dexie-react-hooks";

const StoryModal: React.FC<{id: number;}> = ({ id }) => {
  const router = useRouter();
  const { orgname, boardId } = router.query;

  const story = useLiveQuery(
    () =>
      db.stories.where({ id: Number(id) }).first()
  );

  return (
    <Modal
      // size should be 4xl for anything less than lg, and 3xl for anything more than lg
      size={'4xl'}
      isOpen={true}
      onClose={() => {
        router.push(`/${orgname}/roadmap/${boardId}`)
      }}>
      {story ?
        <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {story.title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display={'flex'}
          flex={1}
          flexDirection={'row'}
        >
          <Stack
            p={4}
            w={'100%'}
            border={'1px solid gold'}
          >
            STORY MODAL for id {id}
          </Stack>
          <Stack
            w={'100%'}
            border={'1px solid red'}
          >
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
