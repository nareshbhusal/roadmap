import { NextPageWithLayout } from '../../types/page';
import Layout from '../../layouts/layout';
import { useState, useEffect } from 'react';
import Head from 'next/head';
// import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Kanban from '../../components/Kanban';

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

const dataset = {
    tasks: {
        "task-1": { id: "task-1", content: "Content for task 1" },
        "task-2": { id: "task-2", content: "Content for task-2" },
        "task-3": { id: "task-3", content: "Content for task-3" },
        "task-4": { id: "task-4", content: "Content for task-4" },
        "task-5": { id: "task-5", content: "Content for task-5" }
    },
    columns: {
        "column-1": { id: "column-1", title: "Todo", taskIds: ['task-1'] },
        "column-2": { id: "column-2", title: "In progress", taskIds: ['task-2', 'task-3'] },
        "column-3": { id: "column-3", title: "Review", taskIds: [] },
        "column-4": { id: "column-4", title: "Completed", taskIds: ["task-4"] },
        "column-5": { id: "column-5", title: "Column 5", taskIds: ["task-5"] }
    },
    columnOrder: ["column-1", "column-2", "column-3", "column-4", "column-5"]
}

// TODO:Model the board data
// TODO: Add other ui controls -
// -- adding and removing cards
// -- adding and removing columns
// TODO: Make the ui better

const Roadmap: NextPageWithLayout = () => {
  return (
    <Stack
  // TODO: This is taking more width than avaliable when width not specified, or alignSelf
      alignSelf={'stretch'}
      spacing={8}>
      <Head>
        <title>Roadmap</title>
      </Head>
      <Heading m={5} mb={2} size="md">Project Board</Heading>
      <Box>
        <Kanban dataset={dataset} />
      </Box>
      <Text>
        Some more page content
      </Text>
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
