import {
  Tag,
  Input,
  FormControl,
  FormLabel,
  IconButton,

  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useBoolean,
} from '@chakra-ui/react';
import { SmallCloseIcon, AddIcon, SmallAddIcon } from '@chakra-ui/icons';

import { useRef, useState } from 'react';
import TagEditForm from './TagEditForm';
import { TAG_COLORS } from '../../../lib/constants';

const StoryTag = ({ tag, removeHandler }: any) => {
  const [ isOpen, setIsOpen ] = useBoolean(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  return (
    <Popover
      isOpen={isOpen}
      onOpen={setIsOpen.on}
      onClose={setIsOpen.off}
      placement='bottom'
      closeOnBlur={true}
      // initialFocusRef={firstFieldRef}
      arrowSize={13}
      returnFocusOnClose={false}
      size={'sm'}
      variant='responsive'
    >
      <PopoverAnchor>
        <Tag
          padding={'0.45rem 0.45rem'}
          colorScheme={TAG_COLORS[1]}
          ref={tagRef}
          variant={'subtle'}
          mb={'3px'}
          size={'sm'}
          mr={'3px'}
          borderRadius={'1rem'}
          display={'flex'}
          cursor={'default'}
          onClick={(e) => {
            console.log('clicked');
            if (e.target === closeButtonRef.current ||
                closeButtonRef.current!.contains(e.target)
               ) {
                 console.log('clicked close button');
                 if (isOpen) {
                   setIsOpen.off();
                 }
                 return;
               }
               console.log('===')
               console.log(`isOpen: ${isOpen}`);
               if (isOpen){
                 return setIsOpen.off();
               }
               setIsOpen.on();
               console.log(`isOpen: ${isOpen}`);
               console.log('===')
          }}
        >
            {tag.label}
          <IconButton
            aria-label={'Delete tag'}
            icon={<SmallCloseIcon />}
            padding={'1px 0px'}
            ref={closeButtonRef}
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
      </PopoverAnchor>
      <PopoverContent w={'inherit'}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          Edit Tag
        </PopoverHeader>
        <PopoverBody>
          <TagEditForm
            closeForm={() => {
              setIsOpen.off();
            }}
            firstFieldRef={firstFieldRef} tag={tag} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default StoryTag;
