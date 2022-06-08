import {
  Stack,
  Flex,
  Heading,
  Text,
  Checkbox,
  CheckboxGroup,
  Button,
  Box
} from '@chakra-ui/react';
import React, { useRef } from 'react';

export interface DescriptionProps {
  description: string;
  updateHandler: React.FocusEventHandler<HTMLDivElement>;
}

const Description: React.FC<DescriptionProps> = ({ description, updateHandler }) => {

  const descriptionRef = useRef(null);

  return (
    <Stack spacing={'10px'}>
      <Flex
        alignItems={'center'}
      >
        <Heading p={1} fontSize={'1rem'} as={'h3'}>
          Description
        </Heading>
        <Button
          size={'sm'}
          mx={'1'}
          p={'1.2 1.5'}
          variant={'outline'}
          onPointerUp={() => {
            const descriptionElement = descriptionRef.current as any;
            if (descriptionElement) {
              descriptionElement.focus();
            }
          }}
        >
          Edit
        </Button>
      </Flex>
      <Box
        contentEditable={true}
        suppressContentEditableWarning={true}
        ref={descriptionRef}
        borderRadius={'md'}
        transitionDuration={'0.2s'}
        _focus={{
          outline:'2px solid blue'
        }}
        p={1}
        dangerouslySetInnerHTML={{ __html: description! }}
        onBlur={updateHandler}
      >
      </Box>
    </Stack>
  );
}

export default Description;
