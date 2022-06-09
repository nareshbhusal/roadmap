import { Box, Flex } from '@chakra-ui/react';

const DragHandle = ({ listeners, attributes }: { listeners: any; attributes: any; }) => {
  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      __hover={{
        cursor: 'grab',
      }}
      __focus={{
        cursor: 'grab',
      }}
      p={'0.25rem'}
      paddingLeft={'0.1rem'}
      h={'100%'}
      {...listeners}
      {...attributes}>
      <svg viewBox="0 0 20 20" width="12">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z">
        </path>
      </svg>
    </Flex>
  );
}

export default DragHandle;
