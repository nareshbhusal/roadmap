import {
  Input,
  Select,
  HStack,
  Button,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { SmallCloseIcon } from '@chakra-ui/icons';
import { IdeaStatus } from '../types';

const makeFirstLetterUppercase = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

// TODO: Work with these as centralised constants
export const sortByValues = ['Most recent', 'Least effort', 'Highest impact'];

export interface SearchAndFilterKeys {
  searchTerm: string;
  sortBy: typeof sortByValues[number];
  activationStatus: typeof activationStatuses[number];
}

export const activationStatuses = (['active', 'completed', 'archived'] as unknown) as IdeaStatus[];

export const defaultSearchValues: SearchAndFilterKeys = {
  searchTerm: '',
  activationStatus: activationStatuses[0],
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
      justifyContent={'flex-start'}
      alignSelf={'flex-start'}
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
        {...register("activationStatus")}
        size={'sm'}
        _hover={{
          borderColor: hoverBorderColor
        }}
        background={'white'}>
        {activationStatuses.map((status, index) => (
          <option key={index} value={status}>{makeFirstLetterUppercase(status)}</option>
        ))}
      </Select>

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
        justifySelf={'flex-end'}
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
