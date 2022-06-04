import {
  Flex,
  Link,
  Box,
  Icon
} from '@chakra-ui/react';

import { useRouter } from 'next/router'

import NextLink from 'next/link';

import { IoSettingsSharp } from 'react-icons/io5';
import { FaLightbulb } from 'react-icons/fa';
import { AiFillGithub } from 'react-icons/ai';
import { BsKanbanFill } from 'react-icons/bs';
import ExternalLink from '../components/ExternalLink';
import { HiClipboard as BoardIcon } from 'react-icons/hi';
// import { HiOutlineViewBoards as BoardIcon } from 'react-icons/hi';

export interface Icons {
  [key: string]: React.FC<any>;
}[];

const icons: Icons = {
  'boards': BsKanbanFill,
  'ideas': FaLightbulb,
  'settings': IoSettingsSharp,
  'github': AiFillGithub,
}

export interface SidebarLinkProps {
  href: string;
  name: string;
}

export const LINK_MARGIN_LEFT='10px';

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, name }) => {

  const router = useRouter();
  // is href contained in asPath
  const isActive = router.asPath.toString().includes(href);
  // const isActive = router.asPath.toString() === href;

  const widthOfActiveBar='5px';
  let iconLeftMargin = LINK_MARGIN_LEFT;

  if (isActive){
    iconLeftMargin='5px';
  }

  return (
    <Link
      href={href}
      color={isActive? 'blue.500' : 'gray.600'}
      fontSize={'sm'}
      borderRadius={'2px'}
      //TODO remove padding
      // px={'7.5px'}
      _hover={{
        textDecoration: 'none',
        color: 'blue.600',
        // background: 'gray.75'
      }}
      _active={{
        background: 'gray.100',
      }}
      _focus={{
        outline: 'none',
        background: 'gray.100'
      }}
      background={isActive? 'gray.75': 'transparent'}
      width={'100%'}>
      <NextLink href={href}>
        <Flex
          flexDirection={'row'}
          alignItems={'stretch'}
          align={'center'}>
          {isActive?
            <Box
              background={'blue.500'}
              width={widthOfActiveBar}
              >
              </Box>:
          null}
          <Icon
            as={icons[name.toLowerCase()] || BoardIcon}
            alignSelf={'center'}
            fontSize={'md'}
            marginLeft={iconLeftMargin} />
          <Box
            py={'10px'}
            fontWeight={isActive ? 'semibold': 'normal'}
            px={'8px'}>
            {name}
          </Box>
        </Flex>
      </NextLink>
    </Link>
  );
}

export const SidebarExternalLink: React.FC<SidebarLinkProps> = ({ href, name }) => {

  const iconLeftMargin = LINK_MARGIN_LEFT;

  return (
    <Link
      href={href}
      color={'gray.600'}
      fontSize={'sm'}
      borderRadius={'2px'}
      _hover={{
        textDecoration: 'none',
        color: 'blue.600',
      }}
      _active={{
        background: 'gray.100',
      }}
      _focus={{
        outline: 'none',
        background: 'gray.100'
      }}
      background={'transparent'}
      width={'100%'}>
      <ExternalLink href={href}>
        <Flex
          flexDirection={'row'}
          alignItems={'stretch'}
          align={'center'}>
          <Icon
            as={icons[name.toLowerCase()]}
            alignSelf={'center'}
            fontSize={'md'}
            marginLeft={iconLeftMargin} />
          <Box
            py={'10px'}
            fontWeight={'normal'}
            px={'8px'}>
            {name}
          </Box>
        </Flex>
      </ExternalLink>
    </Link>
  );
}

export default SidebarLink;
