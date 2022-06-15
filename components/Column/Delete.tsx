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
  MenuItem,
  useDisclosure
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FiTrash } from 'react-icons/fi';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../db';

const Delete: React.FC<{ id: number; refreshData: Function }> = ({ id, refreshData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const deleteHandler = async () => {
    await db.deleteBoardList(id);
    refreshData();
  }

  return (
    <>
      <MenuItem
        icon={<FiTrash />}
        onClick={onOpen}>
        Delete Column
      </MenuItem>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Column
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this column?
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
