import {
  Stack,
  FormLabel,
  Flex,
  Text
} from '@chakra-ui/react';
import { IdeaStatus } from '../types';
import { db } from '../db';
import { default as ReactSelect } from 'react-select';

const Options = (props: any) => {
  const { innerRef, innerProps, data } = props;
  return (
    <Flex
      {...props.getStyles('option', props)}
      ref={innerRef}
      {...innerProps}
      cursor={'pointer'}
    >
      <Text color={props.data.color}>
        {props.data.label}
      </Text>
    </Flex>
  );
}

const SingleValue = (props: any) => {
  const { innerRef, innerProps, data } = props;
  return (
    <Flex
      {...props.getStyles('singleValue', props)}
      ref={innerRef}
      {...innerProps}
      padding={0}
    >
      <Text
        color={props.data.color}>
        {props.data.label}
      </Text>
    </Flex>
  );
}

const customStyles = {
  menu: (base: any) => ({
    ...base,
  }),
  control: (base: any) => ({
    ...base,
    cursor: 'pointer'
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: 0,
  })
}

const Status: React.FC<{ status: IdeaStatus; ideaID: number }> = ({ status, ideaID }) => {
  const statuses: { key: IdeaStatus; label: string; setTo: string; color: string; }[] = [
    { key: 'active', label: 'Active', setTo: 'Activate', color: 'darkgreen' },
    { key: 'archived', label: 'Archived', setTo: 'Archive', color: '#b58526'},
    { key: 'completed', label: 'Completed', setTo: 'Complete', color: 'black' },
  ];

  const currentStatus = statuses.find(s => s.key === status)!;
  const value = {
    value: currentStatus.key,
    label: currentStatus.label,
    setTo: currentStatus.setTo,
    color: currentStatus.color
  }

  let options = [
    {
      label: 'Set status',
      options: statuses
      .filter(s => s.key !== status)
      .map(status => ({
        value: status.key,
        label: status.setTo,
        color: status.color
      }))
    }
  ];

  return (
    <Stack>
      <FormLabel
        requiredIndicator={<Text></Text>}
        variant={'small'}
        htmlFor="status">
        Status
      </FormLabel>
      <ReactSelect
        // @ts-ignore
        options={options}
        components={{
          Option: Options,
          IndicatorSeparator: () => null,
          SingleValue
        }}
        name={'status'}
        styles={customStyles}
        isSearchable={false}
        id={'status'}
        value={value}
        onChange={async (option: any) => {
          const newStatus = statuses.find(s => s.key === option.value)!.key;
          await db.setIdeaStatus(ideaID, newStatus);
        }}
      />
    </Stack>
  );
}

export default Status;
