import {
  Stack,
  Flex,
  Tag,
  Heading,
  Text,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react';

import ReactSelect from 'react-select';
import { db } from '../../db';
import { PrioritiesMappingArray } from '../../lib/constants';
import { PriorityValue } from '../../types';
import StoryPriority from '../StoryPriority';

const customStyles = {
  option: (provided: any, state: any) => {
    return  {...provided,
      cursor: 'pointer',
      margin: 0,
      padding: 0
    }
  },
  control: () => ({
    padding: 0,
    width: '100px',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  singleValue: (provided: any, state: any) => {
    const width='auto';
    const cursor = 'default';

    return { ...provided, width, cursor };
  }
}

const CustomOption = (props: any) => {
  const { innerRef, innerProps, isSelected, isFocused } = props;
  const backgroundColor = isSelected ? 'blue.100' : isFocused ? 'gray.100' : '#fff';
  return (
    <Flex
      {...props.getStyles('option', props)}
      {...innerProps}
      padding={'0.3rem'}
      ref={innerRef}
      cursor={'pointer'}
      backgroundColor={backgroundColor}
    >
      <StoryPriority
        disableBorder={true}
        priority={props.value} />
    </Flex>
  );
}

const SingleValue = (props: any) => {
  const { innerProps, innerRef, getStyles } = props;
  return (
    <Flex
      {...getStyles('singleValue', props)}
      alignItems={'center'}
      ref={innerRef}
      {...innerProps}
      justifyContent={'center'}
      padding={'0.1rem 0.2rem'}
      width={'auto'}
      border={'1px solid #eee'}
      borderRadius={'0.2rem'}
      _hover={{
        backgroundColor: '#efefef'
      }}
      transition={'background-color 50ms'}
      margin={'0'}
      cursor={'pointer'}
    >
      <StoryPriority
        disableBorder={true}
        priority={props.data.value} />
    </Flex>
  );
}

const Priority: React.FC<{ id: number; priority: PriorityValue; }> = ({ id, priority }) => {

  const options = PrioritiesMappingArray.map((v: any) => ({
    value: v.value,
    label: v.text,
  }))

  return (
    <Stack spacing={'10px'}>
      <Heading
        fontWeight={'semibold'}
        fontSize={'15px'}>
        Priority
      </Heading>
      <ReactSelect
        options={options}
        components={{
          SingleValue,
          Option: CustomOption,
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        isSearchable={false}
        styles={customStyles}
        onChange={(v: any) => {
          db.updateStory(id, { priority: v.value });
        }}
        defaultValue={options.find((o: any) => o.value == priority)}
      />
    </Stack>
  );
}

export default Priority;
