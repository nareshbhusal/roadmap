import Head from 'next/head';
import React, { useRef } from 'react'
import Layout from '../../../layouts/layout';
import { NextPageWithLayout } from '../../../types/page';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from "react-hook-form";
import {
  Flex,
  HStack,
  Heading,
  ButtonGroup,
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

import type { IdeaCreateForm, IdeasTag } from '../../../types';

import NextLink from 'next/link';
import { db } from '../../../db';
import useSize from '../../../hooks/useSize';
import Rating from '../../../components/Rating';
import IdeaFormTags from '../../../components/IdeaFormTags';

// TODO: Schema validation with react-hook-form and yup

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
        New Idea
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
          Add Idea
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

const IdeaForm: NextPageWithLayout = () => {

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState
  } = useForm<IdeaCreateForm>({
    defaultValues: defaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { errors }: { errors: any } = formState;
  const size = useSize(containerRef);

  const onSubmit = async (data: any) => {
    const idea: IdeaCreateForm = {
      title: data.title,
      description: data.description,
      tagIDs: data.tagIDs,
      effort: Number(data.effort),
      impact: Number(data.impact),
    };

    await db.addIdea({
      ...idea,
      tagIDs: idea.tagIDs.map((tag: any) => {
        return tag.value;
      }),
    });
  }

  return (
    <Stack
      width={'100%'}
      mb={'50px'}
      ref={containerRef}
    >
      <Head>
        <title>Add Idea</title>
      </Head>
      <Header
        submitHandler={handleSubmit(onSubmit)}
        headerRef={headerRef}
        containerWidth={size ? size.width : 0} />
      <Stack
        spacing={'25px'}
        px={'30px'}
        pt={headerRef.current ? `${headerRef.current.offsetHeight+4}px` : '0px'}
        alignItems={'flex-start'}
        direction={'column'}>
        <FormControl
          isInvalid={errors.title}
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
          isInvalid={errors.description}
          isRequired
        >
          <FormLabel
            requiredIndicator={<Text></Text>}
            variant={'small'}
            htmlFor="description">
            Description
          </FormLabel>
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
