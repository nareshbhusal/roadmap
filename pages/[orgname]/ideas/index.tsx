import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../../layouts/layout';
import { NextPageWithLayout } from '../../../types/page';
import { useForm, useWatch } from "react-hook-form";
import {
  Flex,
  Heading,
  HStack,
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

import IdeaCard from '../../../components/IdeaCard';
import SearchAndFilters, { defaultSearchValues, SearchAndFilterKeys } from '../../../components/FilterIdeas';
import CreateFirstIdea from '../../../components/EmptyState/CreateFirstIdea';

import { useRouter } from 'next/router'
import type { IdeaPreview, IdeasTag } from '../../../types';

import NextLink from 'next/link';
import { db } from '../../../db';
import { useLiveQuery } from "dexie-react-hooks";

export interface IdeasAreaProps {
  ideas: IdeaPreview[];
  totalIdeas: number;
}

const IdeasArea: React.FC<IdeasAreaProps> = ({ ideas, totalIdeas }) => {

  if(!ideas.length) {
    return (
      <Flex>
        <Text fontWeight={'semibold'}>
          No resulting idea for that criteria!
        </Text>
      </Flex>
    );
  }
  return (
    <HStack
      alignItems={'stretch'}
      spacing={0} gap={'20px'} flexWrap={'wrap'}>
      {ideas.map((ideaData: IdeaPreview) => {
        return <IdeaCard key={ideaData.id} idea={ideaData} />
      })}
    </HStack>
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
      px={{ base: '10px', md: '30px' }}
      width={'100%'}
      // align={'center'}
    >
      <Heading
        variant={"page-main-heading"}>
        Ideas
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
        Add New Idea
      </Button>
    </Flex>
  );
}

const Ideas: NextPageWithLayout = () => {
  const router = useRouter();
  const { orgname } = router.query;

  const {
    handleSubmit,
    register,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SearchAndFilterKeys>({
    defaultValues: defaultSearchValues
  });

  const createNewIdea = () => {
    router.push(`/${orgname}/ideas/new`);
  }
  const { searchTerm, activationStatus: status, sortBy } = watch();

  const ideas = useLiveQuery(
    () => db.getIdeas({
      searchTerm,
      status,
      sortBy
    }), [searchTerm, status, sortBy]
  );

  const totalIdeas = useLiveQuery(
    () => db.getTotalIdeas()
  ) || 0;

  return (
    <Stack
      spacing={5}
      width={'100%'}>
      <Head>
        <title>Roadmap App | Ideas</title>
      </Head>
      <Header buttonOnClick={createNewIdea} />
      <Stack
        width={'100%'}
        px={{ base: '10px', md: '30px' }}
        spacing={'35px'}>
        {ideas?
          <Stack>
            {totalIdeas ?
              <Stack
                spacing={'30px'}
              >
                <SearchAndFilters {...{register: register, setValue: setValue, control: control}} />
                <IdeasArea totalIdeas={totalIdeas} ideas={ideas} />
              </Stack>:
              <CreateFirstIdea {...{createNewIdea: createNewIdea}} />
            }
          </Stack>:
            <Flex
              height={'100px'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Text>Loading ideas...</Text>
            </Flex>
        }
      </Stack>
    </Stack>
  );
}

Ideas.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default Ideas;
