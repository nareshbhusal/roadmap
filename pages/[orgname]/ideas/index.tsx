import Head from 'next/head';
import Layout from '../../../layouts/layout';
import { NextPageWithLayout } from '../../../types/page';
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

import IdeaCard from '../../../components/IdeaCard';
import SearchAndFilters, { defaultSearchValues, SearchAndFilterKeys } from './SearchAndFilters';
import CreateFirstIdea from '../../../components/EmptyState/CreateFirstIdea';

import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import type { IdeaData } from '../../../types';

import NextLink from 'next/link';

// Switching sides (vuln, nc, more?)
// TODO hook links
// TODO add page for 0 ideas
// TODO decide on outline color
// TODO add todo nvim plugin
// TODO rename it to Ideas


// NOTE: Create fake rest api to build out the frontend first

// TODO fetch ideas
// const fetchedIdeas: IdeaData[] = [];

const fetchedIdeas: IdeaData[] = [
  {
    id: 2,
    title: 'Test Idea',
    description: 'Idea description',
    createdOn: '1652620008284',
    updatedOn: '1652620008290',
    impact: 4,
    // tags: ['tag1', 'tag2'],
    tags: [],
    effort: 2,
    status: 'active',
    storyID: 2,
    comments: ['c1', 'c2'],
  },
];

export interface IdeasAreaProps {
  watch: any;
  fetchedIdeas: IdeaData[];
}

const IdeasArea: React.FC<IdeasAreaProps> = ({ watch, fetchedIdeas }): JSX.Element => {

  const ideasToRender = fetchedIdeas.filter((idea: IdeaData) => {
    // TODO: 1. Update this
    // 2. Get and finalize data model for idea
    // 3. Create rudimentary idea card
    // 4. add fonts
    const { activationStatus, searchTerm, tag, sortBy } = watch();

    return idea.status === activationStatus.toLowerCase() &&
      idea.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
    (idea.tags.includes(tag) || !tag);
  // TODO: sort
  });


  if(!ideasToRender.length) {
    return (
      <Flex>
        <Text fontWeight={'semibold'}>
          No resulting idea for that criteria!
        </Text>
      </Flex>
    );
  }
  return (
    <Grid
      templateColumns={{"base": "repeat(2, 1fr)", "xl": "repeat(3, 1fr)"}}
      marginBottom={"10px"}
      gap={8} rowGap={12}>
      {ideasToRender.map((ideaData: any) => {
        return <IdeaCard key={ideaData.id} idea={ideaData} />
      })}
    </Grid>
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
        px={'30px'}
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
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<Partial<SearchAndFilterKeys>>({
    defaultValues: defaultSearchValues
  });

  const createNewIdea = () => {
    router.push(`/${orgname}/ideas/new`);
  }

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
        px={'30px'}
        spacing={'35px'}>
      {fetchedIdeas.length?
        <>
          <SearchAndFilters {...{register: register, setValue: setValue}} />
          <IdeasArea {...{watch: watch, fetchedIdeas: fetchedIdeas}} />
        </> :
        <CreateFirstIdea {...{createNewIdea: createNewIdea}} />}
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
