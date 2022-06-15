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


  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../db';

const Delete: React.FC<{ refreshData: Function }> = ({ refreshData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const router = useRouter();
  const { orgname, boardId, story } = router.query;

  const deleteHandler = async () => {
    await db.removeStory(parseInt(story as string));
    router.push(`/${orgname}/roadmap/${boardId}`)
    refreshData();
  }

  return (
    <>
      <Button
        size={'sm'}
        variant={'outline'}
        leftIcon={<DeleteIcon />}
        colorScheme='red'
        maxWidth={'200px'}
        onClick={onOpen}>
        Delete Story
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Story
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this story?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme='red'
                onClick={() => {
                  onClose();
                  deleteHandler();
                }}
                ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Delete;
