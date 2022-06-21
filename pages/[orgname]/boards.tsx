import Head from 'next/head';
import Layout from '../../layouts/layout';
import { NextPageWithLayout } from '../../types/page';
import { useForm, useWatch } from "react-hook-form";
import { useRef, useEffect } from 'react';
import {
  Flex,
  HStack,
  Heading,
  Grid,
  Stack,
  Link,
  FormControl,
  Input,
  Button,
  Text,


  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

import BoardCard from '../../components/BoardCard';
import SearchAndFilters, { defaultSearchValues, SearchAndFilterKeys } from '../../components/FilterBoards';
import CreateFirstBoard from '../../components/EmptyState/CreateFirstBoard';

import { useRouter } from 'next/router'
import type { BoardPreview } from '../../types';

import { db } from '../../db';
import { useLiveQuery } from "dexie-react-hooks";

export interface BoardsAreaProps {
  boards: BoardPreview[];
  totalBoards: number;
}

const BoardsArea: React.FC<BoardsAreaProps> = ({ boards, totalBoards }) => {

  if(!boards.length) {
    return (
      <Flex>
        <Text fontWeight={'semibold'}>
          No resulting board for that criteria!
        </Text>
      </Flex>
    );
  }

  return (
    <HStack
      alignItems={'stretch'}
      spacing={0} gap={'20px'} flexWrap={'wrap'}>
      {boards.map((boardData: BoardPreview) => {
        return <BoardCard key={boardData.id} board={boardData} />
      })}
    </HStack>
  )
}

export interface HeaderProps {
  onModalOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onModalOpen }) => {
  return (
    <Flex
      justify={'space-between'}
      paddingTop={'15px'}
      px={'30px'}
      width={'100%'}
    >
      <Heading
        variant={"page-main-heading"}>
        Boards
      </Heading>
      <Button
        onClick={onModalOpen}
        color={'white'}
        _hover={{
          background: 'blue.500'
        }}
        _active={{
          background: 'blue.500'
        }}
        background={'blue.400'}>
        Add New Board
      </Button>
    </Flex>
  );
}

const Boards: NextPageWithLayout = () => {
  const router = useRouter();
  const { orgname } = router.query;

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SearchAndFilterKeys>({
    defaultValues: defaultSearchValues
  });

  const { searchTerm, sortBy } = watch();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const boards = useLiveQuery(
    () => db.getBoards({
      searchTerm,
      sortBy
    }),
    [searchTerm, sortBy]
  );
  const totalBoards = useLiveQuery(
    () => db.getTotalBoards()
  ) || 0;

  const newBoardTitleRef = useRef<HTMLInputElement>(null);

  const boardCreateHandler = async () => {
    console.log('create board')
    if(newBoardTitleRef.current!.value.trim()) {
      const newBoardId = await db.addBoard(newBoardTitleRef.current!.value.trim());
      onModalClose();
      router.push(`/${orgname}/roadmap/${newBoardId}`);
    }
  }

  return (
    <Stack
      spacing={5}
      width={'100%'}>
      <Head>
        <title>Roadmap App | Boards</title>
      </Head>
      <Header onModalOpen={onModalOpen} />
      <Stack
        width={'100%'}
        px={'30px'}
        spacing={'35px'}>
        {boards?
          <Stack>
            {totalBoards ?
              <Stack
                spacing={'30px'}
              >
                <SearchAndFilters {...{register: register, setValue: setValue}} />
                <BoardsArea totalBoards={totalBoards} boards={boards} />
              </Stack>:
              <CreateFirstBoard {...{createNewBoard: onModalOpen}} />
            }
          </Stack>:
            <Flex
              height={'100px'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Text>Loading boards...</Text>
            </Flex>
        }
        <Modal initialFocusRef={newBoardTitleRef} isOpen={isModalOpen} onClose={onModalClose} closeOnEsc={true}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter New Board Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <Input
                  isRequired={true}
                  onSubmit={boardCreateHandler}
                  name={'board title'}
                  ref={newBoardTitleRef}
                  onKeyUp={(e) => {
                    if(e.key === 'Enter') {
                      boardCreateHandler();
                    }
                  }}
                  placeholder={'Boad title'} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onModalClose} variant='ghost'>Cancel</Button>
              <Button ml={'4px'} colorScheme='blue' mr={3} onClick={boardCreateHandler}>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </Stack>
  );
}

Boards.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default Boards;
