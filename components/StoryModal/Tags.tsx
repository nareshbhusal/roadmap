import {
  Flex,
  Text,
  Box,
  Button,
  Stack,
  Heading,
  IconButton,
  Checkbox,
  CheckboxGroup,
  Tag,
} from '@chakra-ui/react';

import NextLink from 'next/link';
import { db } from '../../db';
import { useLiveQuery } from "dexie-react-hooks";
import CreatableSelect from 'react-select/creatable';
import { StoriesTag } from '../../types';
import { SmallCloseIcon } from '@chakra-ui/icons';

// TODO: Add ability to click on tag to edit or delete it entirely
// TODO: Add color mechanism to tags

const StoryTag = ({ tag, removeProps }: any) => {
  return (
    <Tag
      padding={'0.25rem 0.5rem'}
      colorScheme={'teal'}
      variant={'subtle'}
      borderRadius={'1rem'}
      display={'flex'}
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
        // onClick={(e) => {
        //   console.log(`remove tag ${tag.label}`)
        //   e.stopPropagation();
        // }}
        {...removeProps}
      />
    </Tag>
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
      width={'100%'}
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
          borderRadius={'1rem'}
          alignSelf={'flex-start'}
        >
          {isNew? props.value : props.label}
        </Tag>
      </Flex>
    </Flex>
  );
}

const MultiValue = (props: any) => {
  const { innerRef, innerProps } = props;
  return (
    <Flex
      {...props.getStyles('multiValue', props)}
      {...innerProps}
      borderRadius={'1rem'}
      onMouseDown={(e: any) => e.preventDefault()}
      onTouchEnd={(e: any) => e.preventDefault()}
      onClick={(e) => {
        const toOpenEditor = !e.target.closest('.remove-tag-button');

        if (toOpenEditor){
          console.log(`open editor for tag ${props.data.label}`)
        }
        // props.removeProps.onClick()
      }}
      m={0}
      mr={'4px'}
      ref={innerRef}>
      <StoryTag removeProps={props.removeProps} tag={props.data}/>
    </Flex>
  );
}

export interface TagsProps {
 tags: StoriesTag[];
 storyID: number;
 allTags: any[];
}

// TODO: Some more changes needed to the selector

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
          justifyContent={'flex-left'}>
          {selectedTags && allTags?
            <CreatableSelect
              isMulti
              isClearable={false}
              placeholder={'Add tags'}
              backspaceRemovesValue={false}
              closeMenuOnScroll={false}
              noOptionsMessage={() => <p>No tags found</p>}
              name="tagIDs"
              components={{
                MultiValue ,
                Option,
              }}
              defaultValue={selectedTags}
              options={allTags.map((tag: StoriesTag) => {
                return {
                  value: tag.id,
                  label: tag.text
                }
              })}
              onChange={changeHandler}
            />:
              <Text>Searching for tags...</Text>
          }
        </Flex>
      </Flex>
    </Stack>
  );
}

export default Tags;
