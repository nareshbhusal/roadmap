import Head from 'next/head';
import Layout from '../../layouts/layout';
import { NextPageWithLayout } from '../../types/page';
import { useForm, useWatch } from "react-hook-form";
import {
  Flex,
  Heading,
  Grid,
  Stack,
  Link,
  FormControl,
  Input,
  FormLabel,
  useCheckbox,
  useCheckboxGroup,
  Select,
  Button,
  Text,
  Box
} from '@chakra-ui/react';

import BoardCard from '../../components/BoardCard';
import SearchAndFilters, { defaultSearchValues, SearchAndFilterKeys } from '../../components/FilterBoards';
import CreateFirstBoard from '../../components/EmptyState/CreateFirstBoard';

import { useRouter } from 'next/router'
import type { BoardPreview } from '../../types';

import NextLink from 'next/link';
import { db } from '../../db';
import { useLiveQuery } from "dexie-react-hooks";

export interface BoardsAreaProps {
  watch: () => any;
  fetchedBoards: BoardPreview[];
}

// TODO: Implement new board
// -- opens with focus on new column title input

const BoardsArea: React.FC<BoardsAreaProps> = ({ watch, fetchedBoards }) => {

  const boardsToRender = fetchedBoards.filter((board: BoardPreview) => {
    const { searchTerm, sortBy } = watch();

    return board.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  // TODO: sort
  });


  if(!boardsToRender.length) {
    return (
      <Flex>
        <Text fontWeight={'semibold'}>
          No resulting board for that criteria!
        </Text>
      </Flex>
    );
  }
  return (
    <Grid
      templateColumns={{"base": "repeat(2, 1fr)", "xl": "repeat(3, 1fr)"}}
      marginBottom={"10px"}
      gap={8} rowGap={12}>
      {boardsToRender.map((boardData: BoardPreview) => {
        return <BoardCard key={boardData.id} board={boardData} />
      })}
    </Grid>
  );
}

export interface HeaderProps {
  buttonOnClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ buttonOnClick }) => {
  return (

      <Flex
        justify={'space-between'}
        paddingTop={'15px'}
        px={'30px'}
        width={'100%'}
        // align={'center'}
      >
        <Heading
          variant={"page-main-heading"}>
          Boards
        </Heading>
        <Button
          onClick={buttonOnClick}
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

// TODO: Add another button on the filter section where you can select number of ideas to fetch
// -- and obviously add pagination too
// TODO: Finish filter implementation
// TODO: Add `add new board` feature

const Boards: NextPageWithLayout = () => {
  const router = useRouter();
  const { orgname } = router.query;

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<Partial<SearchAndFilterKeys>>({
    defaultValues: defaultSearchValues
  });
  console.log(watch())

  const createNewBoard = () => {
    router.push(`/${orgname}/boards/new`);
  }

  const boards = useLiveQuery(
    () => db.getBoards()
  );

  console.log('boards');
  console.log(boards);

  return (
    <Stack
      spacing={5}
      width={'100%'}>
      <Head>
        <title>Roadmap App | Boards</title>
      </Head>
      <Header buttonOnClick={createNewBoard} />
      <Stack
        width={'100%'}
        px={'30px'}
        spacing={'35px'}>
        {boards?
          <Stack>
            {boards.length ?
              <Stack
                spacing={'30px'}
              >
                <SearchAndFilters {...{register: register, setValue: setValue}} />
                <BoardsArea watch={watch} fetchedBoards={boards} />
              </Stack>:
              <CreateFirstBoard {...{createNewBoard: createNewBoard}} />
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
