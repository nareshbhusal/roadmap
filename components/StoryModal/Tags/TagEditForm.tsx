import {
  Flex,
  Text,
  Box,
  HStack,
  Button,
  ButtonGroup,
  Stack,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { db } from '../../../db';

const TagEditForm = ({ tag, firstFieldRef, closeForm }: any) => {
  const [name, setName] = useState(tag.label);
  const [color, setColor] = useState(tag.color);

  const router = useRouter();
  const boardId = parseInt(router.query.boardId as string);

  const deleteTagHandler = async () => {
    await db.removeStoriesTag(tag.value, boardId);
    closeForm();
  }
  const submitHandler = async () => {
    await db.editStoriesTag(tag.value, name);
    closeForm();
  }

  return (
    <Stack
      minWidth={'100px'}
      spacing={2}
    >
      <FormControl>
        <FormLabel htmlFor={'tag-name'}>Name</FormLabel>
        <Input
          id={'tag-name'}
          ref={firstFieldRef}
          defaultValue={name}
          size={'sm'}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
        <ButtonGroup display='flex' justifyContent='flex-end'>
          <Button
            colorScheme={'red'}
            size={'sm'}
            variant={'outline'}
            onClick={deleteTagHandler}
          >
            Delete
          </Button>
          <Button
            colorScheme={'blue'}
            size={'sm'}
            onClick={submitHandler}
          >
            Save
          </Button>
        </ButtonGroup>
    </Stack>
  );
}

export default TagEditForm;
