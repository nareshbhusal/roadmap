import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../../layouts/layout';
import { NextPageWithLayout } from '../../../../types/page';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Flex,
  HStack,
  Heading,
  Grid,
  Stack,
  Select,
  Textarea,
  Link,
  FormControl,
  Input,
  FormLabel,
  useCheckbox,
  useCheckboxGroup,
  Button,
  ButtonGroup,
  Text,
  Box,

  Radio,
  RadioGroup,
  useRadio,
  useRadioGroup
} from '@chakra-ui/react';

import type { IdeaUpdateForm, IdeasTag, IdeaStatus } from '../../../../types';

import NextLink from 'next/link';
import { db } from '../../../../db';
import { useLiveQuery } from "dexie-react-hooks";
import { default as ReactSelect } from 'react-select';
import IdeaFormTags from '../../../../components/IdeaFormTags';
import Comments from '../../../../components/IdeaComments';
import Rating from '../../../../components/Rating';

// TODO: Style this better:
// - have the header be sticky with buttons 'go back' and 'save'
// - how to add icons alongside FormLabel
// - effort and impact
// -- a slider feels like it's used to set progress, something like a rating component would suite better
// -- I can't find them in chakra-ui, look into how they're implemented over dribbble shots and mui
//

const LinkToStory: React.FC<{ideaID: number; storyID: number;}> = ({ ideaID, storyID }) => {
  const stories = useLiveQuery(
    () => db.getStories()
  );

  if (!stories) {
    return <Text>Loading...</Text>
  }

  const unlinkFromStory = async () => {
    await db.setStoryToIdea(ideaID, null);
  }
  const options = stories.map(story => {
    return { value: story.id, label: story.title }
  });
  const linkToStory = async (option: any) => {
    await db.setStoryToIdea(ideaID, option.value);
  }

  return (
    <Stack>
      <FormLabel
        requiredIndicator={<Text></Text>}
        variant={'small'}
        htmlFor={'story'}
      >
        Add to Story
      </FormLabel>
      <Flex>
      <ReactSelect
        name="story"
        id={'story'}
        // defaultValue={options.find(option => option.value === storyID)}
        value={options.filter(options => options.value === storyID)}
        onChange={linkToStory}
        options={options}
        />
        {storyID?
          <Button
            marginLeft={'5px'}
            type="button"
            colorScheme={'green'}
            onClick={unlinkFromStory}
          >
            Remove from story
          </Button> :
            <></>
        }
      </Flex>
    </Stack>
  );
}

const Status: React.FC<{ status: IdeaStatus; ideaID: number }> = ({ status, ideaID }) => {
  if (status === 'active') {
    // display 2 buttons with click handlers that
    // - change the status to archived
    // - change the status to completed
    return (
      <Flex>
        <Button
          type="button"
          colorScheme={'green'}
          marginRight={'5px'}
          onClick={() => db.setIdeaStatus(ideaID, 'archived')}
        >
          Archive
        </Button>
        <Button
          type="button"
          colorScheme={'green'}
          onClick={() => db.setIdeaStatus(ideaID, 'completed')}
        >
          Complete
        </Button>
      </Flex>
    );
  } else if (status === 'archived') {
    // display a button that changes the status to active
    return (
      <Button
        type="button"
        colorScheme={'green'}
        onClick={() => db.setIdeaStatus(ideaID, 'active')}
      >
        Activate
      </Button>
    );
  } else if (status === 'completed') {
    // display a button that changes the status to active
    return (
      <Button
        type="button"
        colorScheme={'green'}
        onClick={() => db.setIdeaStatus(ideaID, 'active')}
      >
        Activate
      </Button>
    );
  }
  return null;
}

const defaultFormValues = {
  title: '',
  description: '',
  tagIDs: [],
  effort: 1,
  impact: 1,
}

const EditIdea: NextPageWithLayout = () => {

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState
  } = useForm<IdeaUpdateForm>({
    defaultValues: defaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "comments",
  });

  const { errors }: { errors: any } = formState;
  const router = useRouter();
  const ideaID = router.query.ideaID;

  const idea = useLiveQuery(
    () => db.getIdea(parseInt(ideaID as string)
  ), [ideaID]);

  const onSubmit = async (data: any) => {
    const idea: IdeaUpdateForm = {
      title: data.title,
      description: data.description,
      tagIDs: data.tagIDs.map((tag: any) => tag.value),
      effort: Number(data.effort),
      impact: Number(data.impact),
      comments: data.comments
      .filter((comment: any) => !!comment.value.trim())
      .map((comment: any) => comment.value),
    };

    await db.updateIdea(parseInt(ideaID as string), idea);
    router.push(`/${router.query.orgname}/ideas`);
  }

  const populateForm = async () => {
    const idea = await db.getIdea(parseInt(ideaID as string));
    idea.tagIDs = idea.tags.map((tag: IdeasTag) => {
      return { value: tag.id, label: tag.text };
    });
    idea.comments = idea.comments.map((comment: string) => {
      return { value: comment };
    });
    reset(idea);
  }

  useEffect(() => {
    populateForm();
  }, [ideaID]);

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
      <Stack
        spacing={'25px'}
        alignItems={'flex-start'}
        direction={'column'}>
        <FormControl
          isInvalid={errors.title}
          alignItems={'flex-start'}
          isRequired
        >
          <FormLabel
            requiredIndicator={<Text></Text>}
            variant={'small'}
            htmlFor="title">
            Title
          </FormLabel>
          <Input
            id="title"
            placeholder="Title"
            {...register("title", {
              required: true,
              maxLength: 250
            })}
            name="title"
          />
        </FormControl>
        <FormControl
          isInvalid={errors.impact}
          isRequired
        >
          <FormLabel
            requiredIndicator={<Text></Text>}
            variant={'small'}
            htmlFor="impact">
            Impact
          </FormLabel>
          {/* <Select
            id="impact"
            placeholder="Impact"
            {...register("impact")}
            name="impact"
          >
            {[1, 2, 3, 4, 5].map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </Select> */}
          <Controller
            control={control}
            name={'impact'}
            render={({field: { onChange, value }}) => (
              <Rating
                scale={5}
                name='impact'
                value={value}
                onChange={onChange}
              />)
            }
          />
        </FormControl>
        <FormControl
          isInvalid={errors.effort}
          isRequired
        >
          <FormLabel
            variant={'small'}
            requiredIndicator={<Text></Text>}
            htmlFor="effort">
            Effort
          </FormLabel>
          <Controller
            control={control}
            name={'effort'}
            render={({field: { onChange, value }}) => (
              <Rating
                scale={5}
                name='effort'
                value={value}
                onChange={onChange}
              />)
            }
          />
        </FormControl>
        <IdeaFormTags
          control={control}
          register={register} />
        <Comments watch={watch} fields={fields} append={append} remove={remove} register={register} />
        {idea?
          <>
          <LinkToStory storyID={idea.storyID} ideaID={parseInt(ideaID as string)} />
            <Status status={idea.status} ideaID={parseInt(ideaID as string)} />
          </>:
          <></>}
        <FormControl
          isInvalid={errors.description}
          isRequired
        >
          <FormLabel
            requiredIndicator={<Text></Text>}
            variant={'small'}
            htmlFor="description">
            Description
          </FormLabel>
          <Textarea
            id="description"
            size={'sm'}
            isRequired={false}
            placeholder="Description"
            {...register("description", { required: false })}
            name="description"
          />
        </FormControl>
        <Button
          onClick={handleSubmit(onSubmit)}
          color={'white'}
          _hover={{
            background: 'blue.500'
          }}
          _active={{
            background: 'blue.500'
          }}
          background={'blue.400'}>
          Update Idea
        </Button>
      </Stack>
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
