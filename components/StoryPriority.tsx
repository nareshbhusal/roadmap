import {
  Stack,
  Flex,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';

import { BsFlagFill as PriorityIcon } from 'react-icons/bs';

export type PriorityValue = '1' | '2' | '3' | '4' | '5';

const Priority: React.FC<{ priority: PriorityValue }> = ({ priority }) => {
  const priorities = [
    {
      value: '1',
      text: 'p1',
      color: 'gray.400'
    },
    {
      value: '2',
      text: 'p2',
      color: 'blue.600'
    },
    {
      value: '3',
      text: 'p3',
      color: 'yellow.400'
    },
    {
      value: '4',
      text: 'p4',
      color: 'orange.400'
    },
    {
      value: '5',
      text: 'p5',
      color: 'red.500'
    },
  ];
  const po = priorities.find(p => p.value == priority)!;
  return (
    <Flex
      alignItems={'center'}
      border={'1px solid #ddd'}
      p={'0.1rem 0.3rem'}
      borderRadius={'7px'}
      color={po.color}>
      <PriorityIcon />
      <Text ml={'3px'}>
        {po.text}
      </Text>
    </Flex>
  );
}


export default Priority;
