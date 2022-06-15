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


  Popover,
  PopoverContent,
  PopoverBody,
  PopoverAnchor,
} from '@chakra-ui/react';
import { MdOutlineColorize } from 'react-icons/md';

import { useRouter } from 'next/router';
import { useState } from 'react';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { TAG_COLORS } from '../../../lib/constants';
import { db } from '../../../db';

const SwatchesPicker = ({ color, onChange, presetColors }: any) => {
  return (
    <Stack w={'200px'}>
      <HexColorPicker color={color} onChange={onChange} />

      <HStack
        gap={'2px'}
        spacing={0}
        wrap={'wrap'}>
        {presetColors.map((presetColor: string) => (
          <Button
            size={'xs'}
            mb={'2px'}
            key={presetColor}
            background={presetColor}
            transition={'all 0.2s'}
            _hover={{
              background: presetColor,
            }}
            _focus={{
              background: presetColor,
              outline: `1px solid ${presetColor}`,
            }}
            _active={{
              background: presetColor,
            }}
            onClick={() => onChange(presetColor)}
          />
        ))}
      </HStack>
      <HexColorInput
        style={{
          background: '#eee',
          border: '1px solid #ccc',
          borderRadius: '4px',
          textTransform: 'uppercase',
          textAlign: 'center',
          outline: 'none',
          width: '90px',
          boxSizing: 'border-box',
          padding: '6px',
          font: 'monospace',
          '&:focus, &:hover': {
            borderColor: '#4298ef'
          }
        }}
        color={color}
        onChange={onChange} />
    </Stack>
  );
};

const TagEditForm = ({ tag, firstFieldRef, closeForm, isOpen, setIsOpen }: any) => {
  const [name, setName] = useState(tag.label);
  const [color, setColor] = useState(tag.color || '#777');

  const router = useRouter();
  const boardId = parseInt(router.query.boardId as string);
  const presetColors = TAG_COLORS;

  const deleteTagHandler = async () => {
    await db.removeStoriesTag(tag.value, boardId);
    closeForm();
  }
  const submitHandler = async () => {
    await db.editStoriesTag(tag.value, name, color);
    closeForm();
  }

  return (
    <Popover
      isOpen={isOpen}
      gutter={12}
      placement='bottom'
      closeOnBlur={true}
      arrowSize={0}
      returnFocusOnClose={false}
      size={'sm'}
      variant='responsive'
    >
      <PopoverAnchor>
        <Stack
          minWidth={'100px'}
          maxWidth={'270px'}
          spacing={5}
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
              leftIcon={<MdOutlineColorize />}
              colorScheme={'whatsapp'}
              size={'sm'}
              onClick={() => setIsOpen(!isOpen)}
            >
              Set Color
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
      </PopoverAnchor>
      <PopoverContent w={'inherit'}>
        <PopoverBody>
          <SwatchesPicker
            color={color}
            onChange={setColor}
            presetColors={presetColors}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default TagEditForm;
