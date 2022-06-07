import { NextPageWithLayout } from '../../../types/page';
import Layout from '../../../layouts/layout';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid';
import {
  Flex,
  Stack,
  Text,
  Heading
} from '@chakra-ui/react';

import Board from '../../../components/Board';
import StoryModal from '../../../components/StoryModal';
import { listIdToString } from '../../../components/Column';
import { db } from '../../../db';
import { useLiveQuery } from 'dexie-react-hooks';

const Kanban: NextPageWithLayout = () => {
  const router = useRouter();
  const boardId = parseInt(router.query.boardId as string);

  let boardData = null;
  // const [boardData, setBoardData] = useState<any>(null);
  const [randomString, setRandomString] = useState(uuid());
  // window.alert(uuid())

  const refreshData = () => setRandomString(uuid());

  const data = useLiveQuery(
    () => db.getBoard(boardId), [boardId, randomString]
  );

  if (data) {
    boardData = {
      ...data,
      lists: data.lists.map((list: any) => ({
        ...list,
        id: listIdToString(list.id)
      }))
    }
  }

  const modalStoryId = parseInt(router.query.story as string);

  return (
    <Stack
      width={'100%'}
      height={'100%'}
    >
      <Stack
        padding={'2px'}
      >
        <Head>
          <title>Roadmap</title>
        </Head>
      </Stack>
      {modalStoryId ?
        <StoryModal id={modalStoryId} />:
        null
      }
      {boardData ?
        <Stack flexGrow={1}>
          <Heading
            p={'4px'}
            as={'h2'}
            size={'md'}
          >
            {boardData.name}
          </Heading>
          <Board refreshData={refreshData} boardData={boardData} />
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
