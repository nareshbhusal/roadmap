import Head from 'next/head';
import React, { Component } from 'react'
import Layout from '../../../../layouts/layout';
import { NextPageWithLayout } from '../../../../types/page';
import { useState } from 'react';
import { useForm, useWatch, Controller } from "react-hook-form";
import {
  Flex,
  Heading,
  Grid,
  Stack,
  Select,
  Link,
  FormControl,
  Input,
  FormLabel,
  useCheckbox,
  useCheckboxGroup,
  Button,
  Text,
  Box
} from '@chakra-ui/react';

import type { IdeaData } from '../../../../types';

import NextLink from 'next/link';
import { db } from '../../../../db';
import { useLiveQuery } from "dexie-react-hooks";
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';


const EditIdea: NextPageWithLayout = () => {
  console.log(db.deleteIdeasTag(1));
  return (
    <Stack
      px={'30px'}
      width={'100%'}
      mb={'50px'}
    >
      <Head>
        <title>Edit Idea</title>
      </Head>
      <Heading
        fontSize={'2rem'}
        my={'15px'}
      >
        Edit Idea
      </Heading>

    </Stack>
  );
}

EditIdea.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default EditIdea;
