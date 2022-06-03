import { NextPageWithLayout } from '../../types/page';
import Layout from '../../layouts/layout';
import Head from 'next/head';
import { useState } from 'react';
import {
  Flex,
  Stack,
  Text,
  Heading
} from '@chakra-ui/react';

import BoardsPanel from '../../components/BoardsPanel';
import Board from '../../components/Board';
import { listIdToString } from '../../components/Column';
import { db } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';

const Kanban: NextPageWithLayout = () => {
  const [activeBoardId, setActiveBoardId] = useState(1);
  let boardData = null;
  const data = useLiveQuery(
    () => db.getBoard(activeBoardId), [activeBoardId]);

    if (data) {
      // Doing this because DndContext won't allow stories and lists having the same ids
      boardData = {
        ...data,
        lists: data.lists.map((list: any) => ({
          ...list,
          id: listIdToString(list.id)
        }))
      }
    }

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
            <Board boardData={boardData} />
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
