import {
  Flex,
  Text,
  Button,
  Stack,
  Heading,
  Box,
  Badge,
  Checkbox,
  CheckboxGroup,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import NextLink from 'next/link';
import { db } from '../../db';
import { useLiveQuery } from "dexie-react-hooks";
import CreatableSelect from 'react-select/creatable';
import { StoriesTag } from '../../types';

// TODO: Style tags (including selector) better
// TODO: Add ability to click on tag to edit or delete it entirely

const Tags: React.FC<{ tags: any[], boardId: number; storyID: number; }> = ({ tags, boardId, storyID }) => {

  const allStoriesTags = useLiveQuery(
    () => db.getBoardTags(boardId)
  );

  const selectorTags = tags.map(tag => {
    return {
      value: tag.id,
      label: tag.text
    }
  });

  const changeHandler = async (values: any) => {
    console.log(values);

    // see if all values exists in allStoriesTags
    const isTagCreated = !values.every((v: any) => allStoriesTags!.some((tag: StoriesTag) => tag.id === v.value));

    console.log(`isTagCreated: ${isTagCreated}`);

    if (isTagCreated) {
      const newTagLabel = values[values.length - 1].label;
      const newTag = await db.addStoriesTag(newTagLabel, storyID);
      const oldTags = values.filter((v: any) => !v.__isNew__).map((v: any) => v.value);
      console.log('new tags:');
      console.log([...oldTags, newTag])
      await db.updateStory(storyID, {
        tags: [...oldTags, newTag]
      });
    } else {
      console.log('not creating new story but tags:')
      console.log(values.map((v: any) => v.value))
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
          {selectorTags && allStoriesTags?
            <CreatableSelect
              isMulti
              isClearable={false}
              name="tagIDs"
              defaultValue={selectorTags}
              options={allStoriesTags.map((tag: StoriesTag) => {
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
