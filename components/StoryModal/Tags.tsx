import {
  Flex,
  Text,
  Box,
  HStack,
  Button,
  Stack,
  Heading,
  IconButton,
  Checkbox,
  CheckboxGroup,
  Tag,
  Input,

  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useDisclosure
} from '@chakra-ui/react';

import NextLink from 'next/link';
import { db } from '../../db';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import { StoriesTag } from '../../types';
import { SmallCloseIcon, AddIcon, SmallAddIcon } from '@chakra-ui/icons';

// TODO: Add ability to click on tag to edit or delete it entirely
// TODO: Add color mechanism to tags


const Form = (props: any) => {
  return (
    <Stack
    >
      <Text>
        form
      </Text>
    </Stack>
  );
}

const StoryTag = ({ tag, removeHandler }: any) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement='right'
      closeOnBlur={true}
    >
      <PopoverTrigger>
        <Tag
          padding={'0.45rem 0.45rem'}
          colorScheme={'teal'}
          variant={'subtle'}
          mb={'3px'}
          size={'sm'}
          mr={'3px'}
          borderRadius={'1rem'}
          display={'flex'}
          onClick={() => {
            if (isOpen) {
              // onClose();
            } else {
              onOpen();
            }
          }}
        >
          <Text>
            {tag.label}
          </Text>
          <IconButton
            aria-label={'Delete tag'}
            icon={<SmallCloseIcon />}
            padding={'1px 0px'}
            height={'auto'}
            width={'auto'}
            size={'xs'}
            isRound={true}
            m={0}
            backgroundColor={'transparent'}
            _hover={{
              backgroundColor: 'transparent',
            }}
            _focus={{
              backgroundColor: 'transparent',
            }}
            _active={{
              backgroundColor: 'transparent',
            }}
            className={'remove-tag-button'}
            onClick={removeHandler}
          />
        </Tag>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <PopoverArrow />
        <PopoverCloseButton />
        <Form onCancel={onClose} />
      </PopoverContent>
    </Popover>
  );
}


const Option = (props: any) => {
  const { innerRef, innerProps } = props;
  const isNew = props.data.__isNew__;

  return (
    <Flex
      {...props.getStyles('option', props)}
      {...innerProps}
      cursor={'pointer'}
      background={props.isFocused ? 'gray.100' : '#fff'}
      width={'auto'}
      alignItems={'flex-start'}
      alignSelf={'flex-start'}
      mr={'auto'}
      ref={innerRef}>
      <Flex
        alignItems={'center'}
      >
        {isNew ?
          <Text
            mr={'3px'}
            fontSize={'sm'}>
            Add
          </Text> :
            null}
        <Tag
          padding={'0.3rem 0.5rem'}
          colorScheme={'teal'}
          variant={'subtle'}
          size={'sm'}
          borderRadius={'1rem'}
          // alignSelf={'flex-start'}
        >
          {isNew? props.value : props.label}
        </Tag>
      </Flex>
    </Flex>
  );
}

const SelectInput = (props: any) => {
  return (
    <Box
      minWidth={'30px'}
      alignSelf={'flex-start'}
    >
      <components.Input
        {...props}
      />
    </Box>
  );
}

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator
      {...props}
    >
      <SmallAddIcon fontSize={'lg'} />
    </components.DropdownIndicator>
  );
}

export interface TagsProps {
  tags: StoriesTag[];
  storyID: number;
  allTags: any[];
}


const customStyles = {
  menu: (base: any) => ({
    ...base,
    width: "max-content",
  }),
}

// https://stackoverflow.com/questions/61895814/keeping-placeholder-on-react-select

const Tags: React.FC<TagsProps> = ({ tags, storyID, allTags }) => {

  const selectedTags = tags.map(tag => {
    return {
      value: tag.id,
      label: tag.text
    }
  });
  console.log('running Tags component');

  const changeHandler = async (values: any) => {

    // see if all values exists in allStoriesTags
    const isTagCreated = !values.every((v: any) => allTags!.some((tag: StoriesTag) => tag.id === v.value));

    if (isTagCreated) {
      const newTagLabel = values[values.length - 1].label;
      const newTag = await db.addStoriesTag(newTagLabel, storyID);
      const oldTags = values.filter((v: any) => !v.__isNew__).map((v: any) => v.value);
      await db.updateStory(storyID, {
        tags: [...oldTags, newTag]
      });
    } else {
      await db.updateStory(storyID, {
        tags: values.map((v: any) => v.value)
      });
    }
  }

  const removeTag = async (tagID: number) => {
    const newTags = selectedTags.filter((v: any) => v.value !== tagID);
    await db.updateStory(storyID, {
      tags: newTags.map((v: any) => v.value)
    });
  }

  return (
    <Stack
      spacing={'10px'}
    >
      <Heading
        fontWeight={'semibold'}
        fontSize={'15px'}>
        Tags
      </Heading>
      <Flex
        marginTop={'10px'}>
        <Flex
          flexDirection={'column'}
          width={'auto'}
          alignItems={'flex-start'}
          justifyContent={'flex-left'}>
          {selectedTags && allTags?
            <HStack
              alignItems={'center'}
              justifyContent={'flex-start'}
              flexWrap={'wrap'}
              spacing={'0.35rem'}>
              <Flex
                // alignSelf={'flex-start'}
                justifyContent={'flex-start'}
                flexWrap={'wrap'}>
                {selectedTags.map((tag: any) => {
                  return (
                    <StoryTag
                      key={tag.value}
                      tag={tag}
                      removeHandler={() => removeTag(tag.value)} />
                  );
                })}
              </Flex>
              <CreatableSelect
                isMulti
                isClearable={false}
                placeholder={'Add tags'}
                styles={customStyles}
                backspaceRemovesValue={false}
                closeMenuOnScroll={false}
                noOptionsMessage={() => <p>No tags found</p>}
                name="tagIDs"
                components={{
                  MultiValue: () => null,
                  Option,
                  Input: SelectInput,
                  DropdownIndicator
                }}
                value={selectedTags}
                options={allTags.map((tag: StoriesTag) => {
                  return {
                    value: tag.id,
                    label: tag.text
                  }
                })}
                onChange={changeHandler}
              />
            </HStack>:
            <Text>Searching for tags...</Text>
          }
        </Flex>
      </Flex>
    </Stack>
  );
}

export default Tags;
