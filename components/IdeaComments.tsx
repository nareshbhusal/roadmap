import React, { useState, useEffect, useRef } from 'react';
import {
  Flex,
  Stack,
  IconButton,
  Select,
  Textarea,
  Link,
  FormControl,
  Input,
  FormLabel,
  useCheckbox,
  useCheckboxGroup,
  Button,
  ButtonGroup,
  Text,
  Box
} from '@chakra-ui/react';
import { SmallCloseIcon, CheckIcon } from '@chakra-ui/icons';

import NextLink from 'next/link';
import { MdCheck, MdEdit } from 'react-icons/md';
import { FiTrash, FiPlus } from 'react-icons/fi';

const Comments: React.FC<{ register: any; fields: any[]; append: any; remove: any; watch: any; }> = (
  { register, fields, append, remove, watch }
) => {

  const [isAdding, setIsAdding] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingCommentIndex, setEditingCommentIndex] = useState<null | number>(null);
  const newCommentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAdding){
      newCommentRef.current!.focus();
    }
  }, [isAdding]);

  return (
    <Stack
      alignItems={'flex-start'}
      as={"fieldset"}
      spacing={1}
    >
      <FormLabel
        variant={'small'}
        id={'comment'}
      >
        Comments
      </FormLabel>
      <Stack
        alignItems={'flex-start'}
        spacing={'14px'}>
        <Stack
          spacing={'9px'}
        >
          {fields
            .map((item: any, index: number) => {
              const fieldName = `comments[${index}]`;
              return (
                <Flex key={fieldName}>
                  {editingCommentIndex === index ?
                    <FormControl
                      alignItems={'flex-start'}
                      key={fieldName}>
                      <Textarea
                        size={'sm'}
                        id={'comment'}
                        aria-labelledby={'comment'}
                        type="text"
                        {...register(`comments.${index}.value` as const, {
                          required: true
                        })}
                        name={`${fieldName}.value`}
                      />
                      <ButtonGroup
                        display={'flex'}
                        alignItems={'flex-start'}
                        spacing={'0.2rem'}
                      >
                        <IconButton
                          aria-label={'Remove comment'}
                          icon={<FiTrash />}
                          bg={'transparent'}
                          size={'sm'}
                          type="button"
                          onClick={() => {
                            remove(index);
                            setEditingCommentIndex(null);
                          }} />
                        {watch('comments', 'fields')[index].value.trim() ?
                          <IconButton
                            aria-label={'Save comment'}
                            bg={'transparent'}
                            icon={<CheckIcon />}
                            onClick={() => {
                              if (!item.value.trim()) {
                                remove(index);
                              }
                              setEditingCommentIndex(null);
                            }}
                            size={'sm'}
                          />
                          : null}
                      </ButtonGroup>
                    </FormControl>
                    :
                    <Flex
                      p={'0.2rem 0.2rem'}
                      justifyContent={'space-between'}
                      w={'300px'}
                    >
                      <Text maxWidth={'220px'}>
                        {watch('comments', 'fields')[index].value}
                      </Text>
                      <ButtonGroup
                        spacing={'0.1rem'}
                        alignSelf={'flex-start'}>
                        <IconButton
                          aria-label={'Delete Comment'}
                          icon={<FiTrash />}
                          color={'gray.600'}
                          p={0}
                          bg={'transparent'}
                          _hover={{
                            color: 'gray.900'
                          }}
                          _focus={{
                            color: 'gray.900'
                          }}
                          size={'xs'}
                          onClick={() => {
                            remove(index);
                            if (index === editingCommentIndex){
                              setEditingCommentIndex(null);
                            }
                          }}
                        />
                        <IconButton
                          aria-label={'Edit Comment'}
                          icon={<MdEdit />}
                          color={'gray.600'}
                          _hover={{
                            color: 'gray.900'
                          }}
                          _focus={{
                            color: 'gray.900'
                          }}
                          onClick={() => {
                            setEditingCommentIndex(index);
                          }}
                          bg={'transparent'}
                          p={0}
                          size={'xs'}
                        />
                      </ButtonGroup>
                    </Flex>
                  }
                </Flex>
              );
            })}
        </Stack>

        {isAdding ?
          <FormControl>
            <Textarea
              size={'sm'}
              id={'comment'}
              onChange={(e) => setNewComment(e.target.value)}
              ref={newCommentRef}
              aria-labelledby={'comment'}
            />
            <ButtonGroup>
              <IconButton
                aria-label={'Cancel comment'}
                icon={<SmallCloseIcon />}
                size={'sm'}
                type="button"
                bg={'transparent'}
                onClick={() => {
                  setIsAdding(false);
                }}
              />
              {newComment.trim() ?
                <IconButton
                  aria-label={'Save comment'}
                  icon={<CheckIcon />}
                  onClick={() => {
                    setIsAdding(false);
                    append({
                      value: newCommentRef.current!.value
                    });
                  }}
                  size={'sm'}
                /> :
                  null}
            </ButtonGroup>
          </FormControl>
          :

          <Button
            mt={'1rem'}
            size={'sm'}
            leftIcon={<FiPlus />}
            type="button"
            variant={'outline'}
            colorScheme={'blue'}
            py={'0.7remrem'}
            onClick={() => {
              setIsAdding(true);
            }}>
            Add Comment
          </Button>
        }
      </Stack>
    </Stack>
  );
}

export default Comments;
