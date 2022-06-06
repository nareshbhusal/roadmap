import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../../layouts/layout';
import { NextPageWithLayout } from '../../../../types/page';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
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

import type { IdeaUpdateForm, IdeasTag } from '../../../../types';

import NextLink from 'next/link';
import { db } from '../../../../db';
import { useLiveQuery } from "dexie-react-hooks";
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import { default as ReactSelect } from 'react-select';

export interface IdeaFormTagsProps {
  register: any;
  control: any;
}

const IdeaFormTags: React.FC<IdeaFormTagsProps> = ({ register, control }) => {

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

const Comments: React.FC<{ register: any; fields: any[]; append: any; remove: any; }> = ({ register, fields, append, remove }) => {

  const addComment = () => {
    append({
      value: ''
    });
  };

  return (
    <Stack as={"form"}
      marginTop={'10px'}
    >
      <Heading
        fontWeight={'semibold'}
        fontSize={'15px'}
        marginBottom={'15px'}>
        Comments
      </Heading>
      {fields.map((item: any, index: number) => {
        const fieldName = `comments[${index}]`;
        return (
          <FormControl key={fieldName}>
            <Flex>
            <Input
              type="text"
              {...register(`comments.${index}.value` as const, {
                required: true
              })}
              name={`${fieldName}.value`}
            />
              <Button marginLeft={'5px'} type="button" onClick={() => remove(index)}>
              Remove
            </Button>
            </Flex>
          </FormControl>
        );
      })}

      <Button type="button" onClick={addComment}>
        Add Comment
      </Button>
    </Stack>
  );
}

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
      <Heading
        as={'h3'}
        fontWeight={'semibold'}
        fontSize={'15px'}
        marginBottom={'15px'}>
        Add to Story
      </Heading>
      <Flex>
      <ReactSelect
        name="stories"
        // defaultValue={options.find(option => option.value === storyID)}
        defaultValue={options.filter(options => options.value === storyID)}
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
  console.log(watch());

  const idea = useLiveQuery(
    () => db.getIdea(parseInt(ideaID as string)
  ));

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
    console.log(idea);
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
        direction={'column'}>
        <FormControl
          isInvalid={errors.title}
          isRequired
        >
          <FormLabel htmlFor="title">Title</FormLabel>
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
          isInvalid={errors.description}
          isRequired
        >
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input
            id="description"
            isRequired={false}
            placeholder="Description"
            {...register("description", { required: false })}
            name="description"
          />
        </FormControl>
        <FormControl
          isInvalid={errors.impact}
          isRequired
        >
          <FormLabel htmlFor="impact">Impact</FormLabel>
          <Select
            id="impact"
            placeholder="Impact"
            {...register("impact")}
            name="impact"
          >
            {[1, 2, 3, 4, 5].map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl
          isInvalid={errors.effort}
          isRequired
        >
          <FormLabel htmlFor="effort">Effort</FormLabel>
          <Select
            id="effort"
            placeholder="Effort"
            {...register("effort")}
            name="effort"
          >
            {[1, 2, 3, 4, 5].map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </Select>
        </FormControl>
        <IdeaFormTags
          control={control}
          register={register} />
        <Comments fields={fields} append={append} remove={remove} register={register} />
        {idea?
          <LinkToStory storyID={idea.storyID} ideaID={parseInt(ideaID as string)} />:
          <></>}
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
