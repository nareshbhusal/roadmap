import { NextPageWithLayout } from '../../types/page';
import Layout from '../../layouts/layout';
import { useDrop, useDrag, useDragDropManager } from "react-dnd";
import Head from 'next/head';

import { useState, useEffect, useRef } from 'react';
import {
  Flex,
  Input,
  Button,
  Stack,
  FormLabel,
  Text,
  FormControl,
  Heading
} from '@chakra-ui/react';

import { db } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';
import Board from '../../components/Kanban';

export interface BoardsPanelProps {
  setActiveBoard: Function;
  activeBoardId: number;
}

const BoardsPanel: React.FC<BoardsPanelProps> = ({ setActiveBoard, activeBoardId }) => {
  const [boardTitle, setBoardTitle] = useState('');
  const boards = useLiveQuery(() =>
    db.boards.toArray()) || [];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    db.addBoard(boardTitle);
  };

  return (
    <Stack
      spacing={4}
      h="100%"
      maxW="sm"
      p={4}
    >
      <Flex
        flexDirection={'row'}
      >
      <FormControl
        display={'flex'}
      >
        <Input
          id="board-title"
          placeholder="Board title"
          w={'230px'}
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
        />
        <Button
          type="submit"
          marginLeft={1}
          background={'green'}
          color={'white'}
          p={1}
          onClick={handleSubmit}
        >
          Create Board
        </Button>
      </FormControl>
      </Flex>
      <Flex>
        {boards.map((board) => (
          <Button
            key={board.id}
            m={1}
            border={board.id === activeBoardId ? '2px solid #00bcd4' : '2px solid #e0e0e0'}
            backgroundColor="blue"
            _hover={{ backgroundColor: 'blue.500' }}
            color={'white'}
            onClick={() => {
              console.log(`set new active board: ${board.id}`);
              setActiveBoard(board.id);
            }}
          >
            {board.name}
          </Button>
        ))}
      </Flex>
    </Stack>
  );
}

const Kanban: NextPageWithLayout = () => {
  const [activeBoardId, setActiveBoardId] = useState(1);
  const data = useLiveQuery(
    () => db.getBoard(activeBoardId), [activeBoardId]);

    // const dragDropManager = useDragDropManager();

    return (
      <Stack
        width={'100%'}
        height={'100%'}
      >
        <Stack
          padding={'2px'}
        >
          <Flex
            justify= {'space-between'}
            paddingTop={'15px'}
            px={'30px'}
            width={'100%'}
            // align={'center'}
          >
            <Head>
              <title>Roadmap</title>
            </Head>
            <Heading
              variant={"page-main-heading"}>
              Kanban Board
            </Heading>
          </Flex>
          <BoardsPanel activeBoardId={activeBoardId} setActiveBoard={setActiveBoardId} />
        </Stack>
        {data ?
          <Stack flexGrow={1}>
            <Text>Board with title `{data.name}`</Text>
            <Board boardData={data} />
          </Stack>:
          <Text>Loading...</Text>
        }
      </Stack>
    );
}

Kanban.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default Kanban;
