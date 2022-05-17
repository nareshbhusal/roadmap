import { NextPageWithLayout } from '../../types/page';
import Layout from '../../layouts/layout';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import '@asseinfo/react-kanban/dist/styles.css';
import dynamic from 'next/dynamic';

import {
  Flex,
  Heading,
  Stack,
  Link,
  Button,
  Grid,
  Text,
  Box
} from '@chakra-ui/react';

// TODO: Add kanban board
// Data model for story:
// ideas, subtasks, priority, description, title, completition-status

const board = {
  columns: [
    {
      id: 1,
      title: "Backlog",
      cards: [
        {
          id: 1,
          title: "Card title 1",
          description: "Card content"
        },
        {
          id: 2,
          title: "Card title 2",
          description: "Card content"
        },
        {
          id: 3,
          title: "Card title 3",
          description: "Card content"
        }
      ]
    },
    {
      id: 2,
      title: "Doing",
      cards: [
        {
          id: 9,
          title: "Card title 9",
          description: "Card content"
        }
      ]
    },
    {
      id: 3,
      title: "Q&A",
      cards: [
        {
          id: 10,
          title: "Card title 10",
          description: "Card content"
        },
        {
          id: 11,
          title: "Card title 11",
          description: "Card content"
        }
      ]
    },
    // {
    //   id: 4,
    //   title: "Production",
    //   cards: [
    //     {
    //       id: 12,
    //       title: "Card title 12",
    //       description: "Card content"
    //     },
    //     {
    //       id: 13,
    //       title: "Card title 13",
    //       description: "Card content"
    //     }
    //   ]
    // }
  ]
};

export interface CardProps {
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
  return (
    <Box
      as="article"
      borderWidth="1px"
      borderRadius="md"
      p={4}
      px={20}
      mb={10}
      bg="white"
      boxShadow="lg"
    >
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text>{description}</Text>
    </Box>
  );
};

export interface ColumnProps {
  title: string;
  removeColumn: any;
  renameColumn: any;
  addCard: any;
}

export interface ColumnState {
  id: number;
  title: string;
  cards: CardProps[];
}

const Column: React.FC<ColumnProps> = ({ title, removeColumn, renameColumn, addCard }) => {

  const [columnTitle, setColumnTitle] = useState(title);

  return (
    <Box
      as="section"
      borderWidth="1px"
      borderRadius="md"
      p={4}
      px={20}
      mb={10}
      bg="white"
      boxShadow="lg"
    >
      <Heading as="h3" size="md" mb={2}>
        {columnTitle}
      </Heading>
      <Stack spacing={4}>
        <Button
          color="blue"
          variant="outline"
          onClick={() => {
            addCard(columnTitle);
          }}
        >
          Add card
        </Button>
        <Button
          color="red"
          variant="outline"
          onClick={() => {
            removeColumn(columnTitle);
          }}
        >
          Remove column
        </Button>
        <Button
          color="green"
          variant="outline"
          onClick={() => {
            renameColumn(columnTitle);
          }}
        >
          Rename column
        </Button>
      </Stack>
    </Box>
  );
};


const ControlledBoard: React.FC = () => {
  // You need to control the state yourself.
  const [controlledBoard, setBoard] = useState(board);

  const Board: any = dynamic(async () => {
    const mod = await import('../../node_modules/@asseinfo/react-kanban');
    return mod;
  }, {
    ssr: false
  });

  let moveCard: any;
  let addCard: any;
  let addColumn: any;

  useEffect(() => {
    (async function() {
      const mod = await (import('../../node_modules/@asseinfo/react-kanban'));
      moveCard = mod.moveCard;
      addCard = mod.addCard;
      addColumn = mod.addColumn;
    })();
  })

  const handleCardMove = (_card: any, source: any, destination: any) => {
    console.log('card moved');
    console.log(_card);
    console.log(source);
    console.log(destination);
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
    console.log('updatedBoard');
    console.log(updatedBoard);
  }

  const handleColumnMove = (props: any) => {
    console.log(props);
  }

  return (
    <Board
      className="react-kanban-board"
      onCardDragEnd={handleCardMove}
      onColumnDragEnd={handleColumnMove}
      allowAddColumn
      height={'auto'}
      width={'auto'}
      renderCard={Card}
      // renderColumnHeader={(props: any) => (
      //   console.log(props)
      // )}
      disableColumnDrag={false}
    >
      {controlledBoard}
    </Board>
  );
}

const Roadmap: NextPageWithLayout = () => {
  return (
    <Stack
      height={'800px'}
      width={'800px'}
      border={'2px solid red'}
    >
      <Head>
        <title>Roadmap App | Ideas</title>
      </Head>
      <ControlledBoard />
    </Stack>
  );
}

Roadmap.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}


export default Roadmap;
