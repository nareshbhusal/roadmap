import Head from 'next/head';
import React, { Component } from 'react'
import Layout from '../../../layouts/layout';
import { NextPageWithLayout } from '../../../types/page';
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

import type { IdeaData } from '../../../types';

import NextLink from 'next/link';
import { db } from '../../../db';
import { useLiveQuery } from "dexie-react-hooks";
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';


export interface IdeasTag {
  id: number;
  text: string;
}

// TODO: Change the data type with react-hook-form of `effort` and `impact` to numbers
// TODO: Schema validation with react-hook-form and yup

export interface IdeaFormValues {
  title: string;
  description: string;
  tagIDs: {
    value: number;
    label: string;
  }[];
  effort: number;
  impact: number;
}

const addIdea = async (idea: IdeaFormValues) => {
  await db.addIdea({
    ...idea,
    tagIDs: idea.tagIDs.map(tag => {
      return tag.value;
    }),
  });
  console.log('added idea');
}

const IdeaFormTags= ({ register, control }: { register: any; control: any }) => {

  const selectableTags = useLiveQuery(
    () => db.getIdeasTags()
  );

  const [selectedTags, setSelectedTags] = useState<IdeasTag[]>([]);

  const selectorTags = selectableTags?.map(tag => {
    return { value: tag.id, label: tag.text }
  });

  const handleSelect = async (
    newValues: OnChangeValue<any, true>,
    onChange: Function) => {

    const isTagCreated = newValues.some(v => v.__isNew__);
    if (!isTagCreated) {
      return onChange(newValues);
    }

    const newTagLabel = newValues.find(v => v.__isNew__).label;
    try {
      const tagID = await db.addIdeasTag(newTagLabel);
      onChange([...selectedTags, {
        value: tagID,
        label: newTagLabel
      }]);
    } catch(err) {
      console.log(err);
      return console.log('error creating tag');
    }
  }

  return (
    <Flex
    >
      <Heading
        fontWeight={'semibold'}
        fontSize={'15px'}
        marginBottom={'15px'}>
        Tags
      </Heading>
      <Flex
        marginTop={'10px'}>
        <Flex
          flexDirection={'column'}
          width={'300px'}
          justifyContent={'flex-left'}
          marginTop={'20px'}>
          {selectorTags?
            <Controller
              control={control}
              defaultValue={selectorTags}
              name="tagIDs"
              render={({ field: { value, ref, onChange } }) => (
                <CreatableSelect
                  isMulti
                  name="tagIDs"
                  value={value}
                  {...register("tagIDs")}
                  options={selectorTags}
                  onChange={(v: any[]) => handleSelect(v, onChange)}
                  inputRef={ref}
                  // value={selectedTags}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              )}
            />:
              <Text>Searching for tags...</Text>
          }
        </Flex>
      </Flex>
    </Flex>
  );
}


const IdeaForm: NextPageWithLayout = () => {

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState
  } = useForm<IdeaFormValues>({
    defaultValues: {
      title: '',
      description: '',
      tagIDs: [],
      effort: 1,
      impact: 1,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,

  });

  const { errors }: { errors: any } = formState;

  const onSubmit = async (data: any) => {
    const idea: IdeaFormValues = {
      title: data.title,
      description: data.description,
      tagIDs: data.tagIDs,
      effort: Number(data.effort),
      impact: Number(data.impact),
    };
    await addIdea(idea);
  }

  return (
    <Stack
      px={'30px'}
      width={'100%'}
      mb={'50px'}
    >
      <Head>
        <title>Add Idea</title>
      </Head>
      <Heading
        fontSize={'2rem'}
        my={'15px'}
      >
        Create Idea
      </Heading>
      <Stack
        spacing={'25px'}
        direction={'column'}>
        <FormControl
          isInvalid={errors.title}
          isRequired
        >
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            // name="title"
            placeholder="Title"
            {...register("title", {
              required: true,
              maxLength: 250
            })}
          />
        </FormControl>
        <FormControl
          isInvalid={errors.description}
          isRequired
        >
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input
            id="description"
            isRequired={false}
            // name="description"
            placeholder="Description"
            {...register("description", { required: false })}
          />
        </FormControl>
        <FormControl
          isInvalid={errors.impact}
          isRequired
        >
          <FormLabel htmlFor="impact">Impact</FormLabel>
          <Select
            id="impact"
            // name="impact"
            placeholder="Impact"
            {...register("impact")}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Select>
        </FormControl>
        <FormControl
          isInvalid={errors.effort}
          isRequired
        >
          <FormLabel htmlFor="effort">Effort</FormLabel>
          <Select
            id="effort"
            // name="effort"
            placeholder="Effort"
            {...register("effort")}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Select>
        </FormControl>
        <IdeaFormTags
          control={control}
          register={register} />
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
          Add Idea
        </Button>
      </Stack>
    </Stack>
  );
}

IdeaForm.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default IdeaForm;
