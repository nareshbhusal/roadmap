import { Tag } from '@chakra-ui/react';

const IdeaTag = ({ tag, children }: { tag: string; children?: any; }) => {
  return (
    <Tag
      colorScheme={'teal'}
      variant={'outline'}
      size={'sm'}
      fontWeight={'semibold'}
      marginRight={'4px'}
      mb={'2px'}
      borderRadius={'20px'}
      padding={'6px 8px'}
      _hover={{
        cursor: 'default'
      }}>
      {tag}
      {children}
    </Tag>
  );
}

export default IdeaTag;
