import {
  Flex,
  FormControl,
  Input,
  Stack,
  Button,
  Heading,
} from '@chakra-ui/react';

import { useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import Head from 'next/head';
import { db } from '../db';

import Logo from '../components/Logo';

export interface FormValues {
  org: string;
  name: string;
}

const Register = (): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState,
    setFocus
  } = useForm<FormValues>({
    defaultValues: {
      org: '',
      name: ''
    }
  });
  const router = useRouter();

  const { errors, isSubmitting }: {
    errors: any;
    isSubmitting: boolean;
  } = formState;

  const onSubmit = async (values: FormValues) => {
    const { org, name } = values;
    try {
      await db.register(org, name);
      const { organization } = await db.getRegisterationInfo();
      const lastAccessedBoard = await db.getLastAccessedBoard();
      if (lastAccessedBoard) {
        router.push(`/${organization.urlKey}/roadmap/${lastAccessedBoard}`);
      } else {
        router.push(`/${organization.urlKey}/boards`);
      }
    } catch(err){
      console.log(err);
    }
  }

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

  useEffect(() => {
    ['org', 'name'].forEach(name => updateInputErrorRender(name));
  },);

  useEffect(() => {
    setFocus('org');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      minHeight={'100vh'}
      align={'center'}
      justify={'center'}
      background={{'md':'gray.100'}}>
      <Head>
        <title>Register</title>
      </Head>
      <Stack
        as={'form'}
        onSubmit={handleSubmit(onSubmit)}
        align={'center'}
        width={{'base': '100%', 'sm': 'auto'}}
        justify={'center'}
        flexDirection={'column'}
        marginTop={{base: '-40px', md: '0'}}
        spacing={{'base': '2', 'md': '6'}}
        background={'transparent'}>
        <Logo />
        <Stack
          align={'center'}
          justify={'center'}
          width={{'base': '100%', 'sm': '480px'  ,'md': '640px'}}
          flexDirection={'column'}
          boxShadow={{'md':'formborder'}}
          px={{"base": "20px", "md": "100px"}}
          py={'54px'}
          spacing={'5'}
          background={'white'}>
          <Heading
            lineHeight={'9'}
            fontWeight={'semibold'}
            fontSize={'3xl'}>
            Create your account
          </Heading>
          <Stack
            align={'center'}
            justify={'center'}
            width={'100%'}
            spacing={'0px'}
            flexDirection={'column'}>
            <FormControl
              id="org"
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
                borderBottomRadius={'0'}
                // fix that animation
                autoFocus={true}
                boxShadow={'sm'}
                transition={'none'}
                borderColor={'gray.200'}
                id="org"
                borderBottomColor={'gray.50'}
                errorBorderColor={'gray.200'}
                type="text"
                {...register("org", {
                  required: "Org name is required",
                })}
                name="org"
                placeholder="Organization Name" />
            </FormControl>
            <FormControl
              id="name"
              isInvalid={errors.name}
              isRequired={false}>
              <Input
                borderTopRadius={'0'}
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
          <Button
            isLoading={isSubmitting}
            type="submit"
            size={'md'}
            isDisabled={false}
            w={'100%'}
            background={'blue.400'}
            color={'white'}
            loadingText={'Logging you in...'}
            lineHeight={'7'}
            data-cy="submit"
            fontWeight={'semibold'}
            fontSize={'md'}
            _active={{
              background: 'blue.500',
            }}
            _hover={{
              background: 'blue.500',
            }}>
            Create account
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export const getStaticProps = async (context: any) => {
  return {
    props: {
      public: true
    }
  }
}

export default Register;
