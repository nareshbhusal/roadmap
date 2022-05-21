import Head from 'next/head';
import Layout from '../../../layouts/layout';
import { NextPageWithLayout } from '../../../types/page';
import { useForm, useWatch } from "react-hook-form";
import {
  Flex,
  Heading,
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
import SearchAndFilters, { defaultSearchValues, SearchAndFilterKeys } from '../../components/SearchAndFilters';
import CreateFirstIdea from '../../../components/EmptyState/CreateFirstIdea';

import { useRouter } from 'next/router'
import type { IdeaPreview } from '../../../types';

import NextLink from 'next/link';
import { db } from '../../../db';
import { useLiveQuery } from "dexie-react-hooks";

export interface IdeasAreaProps {
  watch: () => any;
  fetchedIdeas: IdeaPreview[];
}

// TODO: name property in react-hook-form fields should come after where register is introduced in the element

const IdeasArea: React.FC<IdeasAreaProps> = ({ watch, fetchedIdeas }) => {

  const ideasToRender = fetchedIdeas.filter((idea: IdeaPreview) => {
    const { activationStatus, searchTerm, tag, sortBy } = watch();

    return idea.status === activationStatus.toLowerCase() &&
      idea.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
      (!tag || idea.tags.some(ideaTag => ideaTag.id === tag.id));
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
      {ideasToRender.map((ideaData: IdeaPreview) => {
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

// TODO: Add another button on the filter section where you can select number of ideas to fetch
// -- and obviously add pagination too


// DEV NOTE: Navigate to the page which uses indexedDB using the router instead of browser refresh

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

  const ideas = useLiveQuery(
    () => db.getIdeas()
  );

  console.log('ideas');
  console.log(ideas);

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
        {ideas?
          <Stack>
            {ideas.length ?
              <Stack
                spacing={'30px'}
              >
                <SearchAndFilters {...{register: register, setValue: setValue}} />
                <IdeasArea watch={watch} fetchedIdeas={ideas} />
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
