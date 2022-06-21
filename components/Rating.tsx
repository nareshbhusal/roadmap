import React, { useState, useEffect } from 'react';
import {
  HStack,
  Heading,
  Grid,
  Stack,
  Select,
  Textarea,
  Link,
  FormControl,
  Input,
  FormLabel,
  useCheckbox,
  useCheckboxGroup,
  Button,
  ButtonGroup,
  Text,
  Box,
  useRadio,
  useRadioGroup
} from '@chakra-ui/react';


const RatingIcon = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        aria-label={`Rate ${props.value}`}
        borderRadius={'100px'}
        bg={props.filled ? 'blue.500' : ''}
        outline={'1px solid blue'}
        outlineColor={'blue.500'}
        borderWidth='1px'
        boxShadow='sm'
        _checked={{
          // borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        p={'0.35rem'}
      >
      </Box>
    </Box>
  )
}

export interface RatingProps {
  scale: number;
  name: string;
  value: number;
  onChange: (v: number) => void;
}

const Rating: React.FC<RatingProps> = ({ name, scale, value, onChange }) => {
  let options = [];
  for (let i = 1; i <= scale; i++) {
    options.push(i);
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue: value,
    onChange: (v) => {
      onChange(parseInt(v))
    }
  });
  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((v) => {
        const radio = getRadioProps({ value: v });
        return (
          <RatingIcon
            key={v}
            {...radio}
            filled={v <= value}
          />
        )
      })}
    </HStack>
  );
}

export default Rating;
