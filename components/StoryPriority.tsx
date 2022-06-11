import {
  Stack,
  Flex,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';

import { BsFlagFill as PriorityIcon } from 'react-icons/bs';
import { PrioritiesMappingArray } from '../lib/constants';
import { PriorityValue } from '../types';

const Priority: React.FC<{ priority: PriorityValue; disableBorder?: boolean; }> = ({ priority, disableBorder }) => {
  const po = PrioritiesMappingArray.find(p => p.value == priority)!;
  return (
    <Flex
      alignItems={'center'}
      border={!disableBorder ? '1px solid #ddd': ''}
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
