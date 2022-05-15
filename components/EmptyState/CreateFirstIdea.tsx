import {
  Flex,
  Heading,
  Button,
  Text,
  Box
} from '@chakra-ui/react';

import { FaPlus, FaLightbulb } from 'react-icons/fa';

export interface CreateFirstIdeaProps {
  createNewIdea: () => void;
}

const CreateFirstIdea: React.FC<CreateFirstIdeaProps> = ({ createNewIdea }) => {
  return (
    <Flex
      width={'100%'}
      marginTop={'35px'}
      justify={'center'}
      align={'center'}
      flex={'1'}
      flexDirection={'column'}>
      <Box
        marginBottom={'15px'}
        fontSize={'40px'}
        color={'gray.300'}>
        <FaLightbulb />
      </Box>
      <Heading
        as={'h2'}
        size={'sm'}>
        No Ideas
      </Heading>
      <Text
        marginTop={'3px'}
        color={'gray.600'}>
        Add your first idea
      </Text>
      <Button
        marginTop={'15px'}
        boxShadow={'lg'}
        color={'white'}
        fontSize={'sm'}
        _hover={{
          background: 'blue.500'
        }}
        _active={{
          background: 'blue.500'
        }}
        onClick={createNewIdea}
        leftIcon={<FaPlus />}
        background={'blue.400'}>
        New idea
      </Button>
    </Flex>
  );
}

export default CreateFirstIdea;
