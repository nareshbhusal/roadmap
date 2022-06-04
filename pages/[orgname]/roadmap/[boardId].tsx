import { NextPageWithLayout } from '../../../types/page';
import Layout from '../../../layouts/layout';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router'
import {
  Flex,
  Stack,
  Text,
  Heading
} from '@chakra-ui/react';

import Board from '../../../components/Board';
import { listIdToString } from '../../../components/Column';
import { db } from '../../../db';
import { useLiveQuery } from 'dexie-react-hooks';

// TODO: Add ability to archive, unarchive, and delete boards

const Kanban: NextPageWithLayout = () => {
  const router = useRouter();
  const boardId = parseInt(router.query.boardId as string);

  let boardData = null;
  const data = useLiveQuery(
    () => db.getBoard(boardId), [boardId]
  );

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
