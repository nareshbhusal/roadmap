import { useState } from 'react';
import { slugify } from '../../lib/utils';
import {
  Flex,
  FormControl,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
} from '@chakra-ui/react';
import Head from 'next/head';
import Layout from '../../layouts/layout';
import { NextPageWithLayout } from '../../types/page';
import { db } from '../../db';

// https://chakra-templates.dev/

import { useEffect } from 'react';
import { useForm } from "react-hook-form";

import NextLink from 'next/link';

type FormValues = {
  org: string;
  name: string;
  toChangeSlug: boolean;
  urlKey: string;
}

// TODO: Implement app-wide length limit on org name and urlKey
// TODO: How do you validate these form/data values, especially across different places in the app,
// including FE to BE full-cover?

// NOTE: https://www.30secondsofcode.org/css/p/1

const Header: React.FC = () => {
  return (
    <Flex
      justify={'space-between'}
      paddingTop={'15px'}
      px={'30px'}
      width={'100%'}
    >
      <Heading
        variant={"page-main-heading"}>
        Update Account Info
      </Heading>
    </Flex>
  );
}

const Settings: NextPageWithLayout = () => {
  const {
    handleSubmit,
    register,
    formState,
    getValues,
    setValue,
    watch,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      org: '',
      name: '',
      toChangeSlug: false,
      urlKey: ''
    }
  });
  const [fetchedUrlKey, setFetchedUrlKey] = useState('');

  const { errors, isSubmitting }: {
    errors: any;
    isSubmitting: boolean;
  } = formState;


  const updateInputErrorRender = (inputName: string): void => {
    const element = document.getElementById(inputName) as HTMLInputElement;

    if (!errors || !errors[inputName]) {
      element.setCustomValidity('');
    } else if (!errors[inputName]) {
      element.setCustomValidity('');
    } else {
      element.setCustomValidity(errors[inputName].message);
    }
  }

  const populateFormFromDB = async () => {
    const { organization, user } = await db.getRegisterationInfo();
    setFetchedUrlKey(organization.urlKey);
    reset({
      org: organization.name,
      name: user.name,
      urlKey: organization.urlKey
    });
  }

  const onSubmit = async (values: FormValues) => {
    const { org, urlKey, name } = values;
    await db.updateAccountInfo({
      name: org,
      urlKey
    }, {
      name
    });
    await populateFormFromDB();
  }

  useEffect(() => {
    ['org', 'name'].forEach(name => updateInputErrorRender(name));
  },);

  useEffect(() => {
    // Fetch account info
    populateFormFromDB();
  }, []);

  const toChangeSlug = watch('toChangeSlug');
  const org = watch('org');

  useEffect(() => {
    // Update urlKey
    const { urlKey, toChangeSlug, org } = getValues();
    if (toChangeSlug) {
      setValue('urlKey', slugify(org), {
        shouldValidate: true
      });
    } else {
      setValue('urlKey', fetchedUrlKey, {
        shouldValidate: true
      });
    }
  }, [toChangeSlug, org]);

  return (
    <Stack
      minHeight={'100vh'}
      width={'100%'}
      align={'flex-start'}>
      <Header />
      <Head>
        <title>Roadmap App | Settings</title>
      </Head>
      <Stack
        as={'form'}
        onSubmit={handleSubmit(onSubmit)}
        align={'flex-start'}
        px={'30px'}
        // width={{'base': '100%', 'sm': 'auto'}}
        justify={'center'}
        flexDirection={'column'}
        spacing={{'base': '2', 'md': '6'}}
        background={'transparent'}>
        <Stack
          align={'center'}
          justify={'center'}
          width={{'base': '100%', 'sm': '480px', 'md': '640px'}}
          maxW={'520px'}
          flexDirection={'column'}
          py={'54px'}
          spacing={'5'}
          background={'white'}>
          <Stack
            align={'center'}
            justify={'center'}
            width={'100%'}
            spacing={'10px'}
            flexDirection={'column'}>
            <FormControl
              id="email"
              isInvalid={errors.org}
              //hack: when invalid, change zIndex to 100
              _invalid={{
                zIndex: '100'
              }}
              _hover={{
                zIndex: '100'
              }}
              isRequired={false}>
              <Input
                // fix that animation
                boxShadow={'sm'}
                transition={'none'}
                borderColor={'gray.200'}
                id="org"
                errorBorderColor={'gray.200'}
                {...register("org", {
                  required: "Org name is required",
                })}
                name="org"
                placeholder="Organization Name" />
            </FormControl>
            <FormControl
              id="password"
              isInvalid={errors.name}
              isRequired={false}>
              <Input
                borderColor={'gray.200'}
                errorBorderColor={'gray.200'}
                // borderTopColor={'gray.50'}
                boxShadow={'sm'}
                transition={'none'}
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
                name="name"
                id="name"
                placeholder="Your Name" />
            </FormControl>
          </Stack>
          <Stack
            align={'center'}
            justify={'center'}
            width={'100%'}
            spacing={'5px'}
            justifyContent={'center'}
            alignItems={'center'}>
            <Flex
              align={'center'}
              w={'100%'}
              flexDirection={'row'}>
              <Checkbox
                size={'md'}
                fontSize={"sm"}
                {...register("toChangeSlug")}
                spacing={'0.3rem'}
                name={'toChangeSlug'}
              >
                Change Url Key
              </Checkbox>
            </Flex>
            <FormControl>
              <Input
                borderColor={'#ccc'}
                boxShadow={'sm'}
                {...register("urlKey")}
                name="urlKey"
                readOnly={true}
                type="text"
              />
            </FormControl>

          </Stack>
          <Button
            isLoading={isSubmitting}
            type="submit"
            size={'md'}
            isDisabled={false}
            width={'100%'}
            background={'blue.400'}
            color={'white'}
            loadingText={'Logging in...'}
            lineHeight={'7'}
            fontWeight={'semibold'}
            fontSize={'md'}
            _active={{
              background: 'blue.500',
            }}
            _hover={{
              background: 'blue.500',
            }}>
            Update
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

Settings.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default Settings;
