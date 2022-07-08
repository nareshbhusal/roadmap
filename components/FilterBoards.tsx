import {
  Input,
  Select,
  HStack,
  Button,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { SmallCloseIcon } from '@chakra-ui/icons';

const makeFirstLetterUppercase = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const sortByValues = ['Most recently active', 'Least recently active', 'Alphabetically', 'Reverse alphabetically', 'Archived'];

export interface SearchAndFilterKeys {
  searchTerm: string;
  sortBy: typeof sortByValues[number];
}

export const defaultSearchValues: SearchAndFilterKeys = {
  searchTerm: '',
  sortBy: sortByValues[0],
}

export interface SearchAndFiltersProps {
  register: any;
  setValue: any;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({ register, setValue }) => {

  const color = 'gray.700';
  const borderColor = 'gray.300';
  const hoverBorderColor = 'gray.400';

  const resetFilters = () => {
    Object.keys(defaultSearchValues).forEach((key: string) => {
      setValue(key, (defaultSearchValues as { [key: string]: any })[key]);
    });
  }

  useEffect(() => resetFilters, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HStack
      as={'section'}
      justifyContent={'flex-start'}
      alignSelf={'flex-start'}
      className={'filter'}
      spacing={{ base: '5px', md: '12px' }}>
      <Input
        size={'sm'}
        background={'white'}
        borderColor={borderColor}
        _placeholder={{
          color: color
        }}
        _hover={{
          borderColor: hoverBorderColor
        }}
        color={color}
        {...register("searchTerm")}
        placeholder={'Search'} />

      <Select
        borderColor={borderColor}
        color={color}
        size={'sm'}
        _hover={{
          borderColor: hoverBorderColor
        }}
        {...register("sortBy")}
        background={'white'}>
        {sortByValues.map((sortByValue: string, index: any) => (
          <option key={index} value={sortByValue}>{sortByValue}</option>
        ))}
      </Select>

      <Button
        width={'100%'}
        // @ts-ignore
        size={{ base: 'xs', md: 'sm' }}
        fontSize={{ base: 'xs', md: 'sm' }}
        borderRadius={'4px'}
        leftIcon={<SmallCloseIcon />}
        onClick={resetFilters}
        padding={'0px'}
        color={'gray.500'}
        variant={'link'}
        _hover={{
          color: 'gray.600'
        }}
        _active={{
          color: 'gray.600'
        }}
        _focus={{
          color: 'gray.600'
        }}
      >
        Reset filters
      </Button>
    </HStack>
  );
}

export default SearchAndFilters;
