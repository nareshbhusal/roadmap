import { NextPageWithLayout } from '../../../types/page';
import Layout from '../../../layouts/layout';
import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid';
import {
  Flex,
  Input,
  Stack,
  Text,
  Heading
} from '@chakra-ui/react';

import Board from '../../../components/Board';
import StoryModal from '../../../components/StoryModal/';
import { listIdToString } from '../../../components/Column/';
import { db } from '../../../db';
import { useLiveQuery } from 'dexie-react-hooks';

const BoardHeading: React.FC<{ name: string; boardId: number; }> = ({ name, boardId }) => {
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [boardName, setBoardName] = useState(name);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      nameInputRef.current!.focus();
    }
  }, [isRenaming]);

  return (
    <>
      {isRenaming ?
        <Input
          width={'300px'}
          ref={nameInputRef}
          value={boardName}
          onChange={(e: any) => setBoardName(e.target.value)}
          fontWeight={'bold'}
          fontSize={'lg'}
          _focus={{
            border: '1px solid #343',
          }}
          onBlur={async () => {
            if (boardName.trim()) {
              await db.updateBoard(boardId, {
                name: boardName.trim()
              });
            }
            setIsRenaming(false);
          }}
          bg={'#fff'}
          color={'#111'}
        /> :
          <Heading
            p={'4px'}
            onClick={() => setIsRenaming(true)}
            as={'h2'}
            color={'#fff'}
            size={'md'}
          >
            {boardName}
          </Heading>
      }
    </>
  );
}

const Kanban: NextPageWithLayout = () => {
  const router = useRouter();
  const boardId = parseInt(router.query.boardId as string);

  let boardData: any = null;
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
      <Stack>
        <Head>
          <title>Roadmap</title>
        </Head>
      </Stack>
      {modalStoryId && data ?
        <StoryModal tags={data.tags} refreshData={refreshData} id={modalStoryId} />:
        null
      }
      {boardData ?
        <Stack
          pl={'30px'}
          flexGrow={1}>
          <BoardHeading boardId={Number(boardId)} name={boardData.name} />
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
