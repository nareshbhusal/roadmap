import {
  Flex,
  Heading,
  Button,
  Text,
  Box
} from '@chakra-ui/react';

import { FaPlus } from 'react-icons/fa';
import { BsFillKanbanFill } from 'react-icons/bs';

export interface CreateFirstBoardProps {
  createNewBoard: () => void;
}

const CreateFirstBoard: React.FC<CreateFirstBoardProps> = ({ createNewBoard }) => {
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
        <BsFillKanbanFill />
      </Box>
      <Heading
        as={'h2'}
        size={'sm'}>
        No Boards
      </Heading>
      <Text
        marginTop={'3px'}
        color={'gray.600'}>
        Add your first board
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
        onClick={createNewBoard}
        leftIcon={<FaPlus />}
        background={'blue.400'}>
        New board
      </Button>
    </Flex>
  );
}

export default CreateFirstBoard;
