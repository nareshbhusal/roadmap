import {
  Stack,
  Flex,
  Heading,
  Text,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react';

import ReactSelect from 'react-select';
import { db } from '../../db';

// TODO: Implement a mappable where we display priority as keywords `high`, `medium`, `low`, etc.
const Priority: React.FC<{ id: number; priority: number; }> = ({ id, priority }) => {

  const priorityOptions = [1, 2, 3, 4, 5].map(i => {
    return {
      value: i,
      label: i
    }
  });

  return (
    <Stack spacing={'10px'}>
      <Heading
        fontWeight={'semibold'}
        fontSize={'15px'}>
        Priority
      </Heading>
      <ReactSelect
        options={priorityOptions}
        isSearchable={false}
        onChange={(v: any) => {
          db.updateStory(id, { priority: v.value });
        }}
        defaultValue={priorityOptions.find(o => o.value == priority)}
      />
    </Stack>
  );
}

export default Priority;
