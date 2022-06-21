import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../../layouts/layout';
import { NextPageWithLayout } from '../../../../types/page';
import React, { useState, useRef, useEffect } from 'react';
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
import useSize from '../../../../hooks/useSize';

import NextLink from 'next/link';
import { db } from '../../../../db';
import { useLiveQuery } from "dexie-react-hooks";
import { default as ReactSelect } from 'react-select';
import IdeaFormTags from '../../../../components/IdeaFormTags';
import Comments from '../../../../components/IdeaComments';
import Rating from '../../../../components/Rating';
import Status from '../../../../components/IdeaStatus';

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
          placeholder={'Select a story'}
          onChange={linkToStory}
          options={options}
        />
        {storyID?
          <Button
            marginLeft={'5px'}
            type="button"
            colorScheme={'gray'}
            // variant={'outline'}
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

export interface HeaderProps {
  submitHandler: React.MouseEventHandler<HTMLButtonElement>;
  headerRef: React.RefObject<HTMLDivElement>;
  containerWidth: number;
}

const Header: React.FC<HeaderProps> = ({ submitHandler, headerRef, containerWidth }) => {
  const router = useRouter();
  const { orgname } = router.query;
  return (
    <HStack
      border={'1px solid transparent'}
      borderBottomColor={'#eee'}
      boxShadow={'xs'}
      position={'fixed'}
      bg={'#fff'}
      px={'1rem'}
      zIndex={200}
      ref={headerRef}
      w={`${containerWidth}px`}
      justifyContent={'space-between'}
    >
      <Heading
        fontSize={'1.25rem'}
        my={'15px'}
        fontWeight={'semibold'}
      >
        Edit Idea
      </Heading>
      <ButtonGroup>
        <Button
          type="button"
          variant={'outline'}
          colorScheme={'gray'}
          onClick={() => {
            // go back to ideas
            router.push(`/${orgname}/ideas`);
          }}
        >
          Go to Ideas
        </Button>
        <Button
          onClick={submitHandler}
          color={'white'}
          _hover={{
            background: 'blue.500'
          }}
          _active={{
            background: 'blue.500'
          }}
          background={'blue.400'}>
          Save
        </Button>
      </ButtonGroup>
    </HStack>
  );
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
    getValues,
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

  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "comments",
  });

  const { errors }: { errors: any } = formState;
  const router = useRouter();
  const ideaID = router.query.ideaID;

  const idea = useLiveQuery(
    () => db.getIdea(parseInt(ideaID as string)), [ideaID]
  );

  const onSubmit = async (data: any) => {
  // when comments' array is empty, it doesn't appear in onSubmit data prop
    data = {
      ...data,
      ...getValues()
    };
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

  const size = useSize(containerRef);

  return (
    <Stack
      width={'100%'}
      mb={'50px'}
      ref={containerRef}
    >
      <Head>
        <title>Edit Idea</title>
      </Head>
      <Header
        containerWidth={size ? size.width : 0}
        headerRef={headerRef}
        submitHandler={handleSubmit(onSubmit)} />
      <Stack
        spacing={'25px'}
        px={'30px'}
        pt={headerRef.current ? `${headerRef.current.offsetHeight+4}px` : '0px'}
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
        {idea?
          <>
            <Status status={idea.status} ideaID={parseInt(ideaID as string)} />
            <LinkToStory storyID={idea.storyID} ideaID={parseInt(ideaID as string)} />
          </>:
          <></>}
        <Comments
          watch={watch}
          fields={fields}
          append={append}
          remove={remove}
          register={register} />
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
