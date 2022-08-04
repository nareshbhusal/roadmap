import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Flex,
  Heading,
  Tag,
  TagCloseButton,
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
  Text,
  Box
} from '@chakra-ui/react';

import type { IdeaUpdateForm, IdeasTag, IdeaStatus } from '../types';

import NextLink from 'next/link';
import { db } from '../db';
import { useLiveQuery } from "dexie-react-hooks";
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue, components } from 'react-select';
import IdeaTag from './IdeaTag';

const Option = (props: any) => {
  const { innerRef, innerProps, data } = props;
  const isNew = props.data.__isNew__;
  // const color = isNew ? '#319795' : props.data.color;

  return (
    <Stack
      {...props.getStyles('option', props)}
      {...innerProps}
      cursor={'pointer'}
      background={props.isFocused ? 'gray.100' : '#fff'}
      width={'auto'}
      flexWrap={'wrap'}
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
        <IdeaTag
          tag={isNew ? props.value : props.label}
        />
        {/* <Tag
          padding={'0.3rem 0.5rem'}
          color={color}
          backgroundColor={lightenColor(color)}
          variant={'subtle'}
          size={'sm'}
          borderRadius={'1rem'}
          // alignSelf={'flex-start'}
        >
          {isNew? props.value : props.label}
        </Tag> */}
      </Flex>
    </Stack>
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

const MultiValue = (props: any) => {
  const { removeProps, data } = props;
  return (
    <Flex
      {...props.getStyles('option', props)}
      cursor={'pointer'}
      background={props.isFocused ? 'gray.100' : '#fff'}
      width={'auto'}
      flexWrap={'wrap'}
      alignItems={'flex-start'}
      p={0}
      mr={'0'}
      my={'1px'}
      ref={props.innerRef}
    >
      <IdeaTag tag={data.label}>
        <TagCloseButton {...removeProps} />
      </IdeaTag>
    </Flex>
  );
}

const customStyles = {
  menu: (base: any) => ({
    ...base,
    // width: "max-content",
    // maxWidth: '280px',
  }),
  control: (base: any) => ({
    ...base,
    cursor: 'pointer',
    // width: 'max-content',
    // maxWidth: '280px',
  }),
  valueContainer: (base: any, state: any) => ({
    ...base,
  })
}

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
      onChange([...newValues.slice(0, newValues.length-1), {
        value: tagID,
        label: newTagLabel
      }]);
    } catch(err) {
      console.log(err);
      return console.log('error creating tag');
    }
  }
  const noOptionsMessage = () => {
    if (!selectableTags) {
      return 'Loading...';
    }
    if (selectableTags.length === 0 && selectedTags.length === 0){
      return <p>No tags found</p>;
    }
    return <p>Type to create new tag</p>;
  }

  return (
    <Stack
      alignItems={'flex-start'}
      width={'100%'}
      spacing={'15px'}
    >
      <FormLabel
        requiredIndicator={<Text></Text>}
        variant={'small'}
        htmlFor="tagIDs">
        Tags
      </FormLabel>
      <Flex
        alignSelf={'flex-start'}>
        <Flex
          flexDirection={'column'}
          alignItems={'flex-start'}
          justifyContent={'flex-left'}>
          {selectorTags?
            <Controller
              control={control}
              defaultValue={selectorTags}
              name="tagIDs"
              render={({ field: { value, ref, onChange } }) => (
                <CreatableSelect
                  isMulti
                  name="tagIDs"
                  styles={customStyles}
                  value={value}
                  {...register("tagIDs")}
                  components={{
                    Option,
                    Input: SelectInput,
                    MultiValue
                  }}
                  options={selectorTags}
                  onChange={(v: any[]) => handleSelect(v, onChange)}
                  inputRef={ref}
                  noOptionsMessage={noOptionsMessage}
                  isClearable={false}
                  placeholder={'Add tags'}
                  className="basic-multi-select"
                  theme={'neutral170'}
                  classNamePrefix="select"
                />
              )}
            />:
              <Text>Searching for tags...</Text>
          }
        </Flex>
      </Flex>
    </Stack>
  );
}

export default IdeaFormTags;
