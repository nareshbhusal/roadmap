import { NextPageWithLayout } from '../../types/page';
import Layout from '../../layouts/layout';
import Head from 'next/head';

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

const Roadmap: NextPageWithLayout = () => {
  return (
    <Stack>
      <Head>
        <title>Roadmap App | Ideas</title>
      </Head>
      <h1>Roadmap</h1>
      <p>
        This page is under construction.
      </p>
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
