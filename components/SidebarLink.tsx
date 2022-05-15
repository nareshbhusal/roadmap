import {
  Flex,
  Link,
  Box,
  Icon
} from '@chakra-ui/react';

import { useRouter } from 'next/router'

import NextLink from 'next/link';

import { IoAnalytics, IoColorPalette, IoSettingsSharp, IoHelpCircleSharp, IoBarChart, IoSpeedometer, IoFlag } from 'react-icons/io5';
import { FaCheckCircle, FaLightbulb, FaUsers, FaLocationArrow } from 'react-icons/fa';
import { BsKanbanFill } from 'react-icons/bs';

export interface Icons {
  [key: string]: React.FC<any>;
}[];

const icons: Icons = {
  'roadmap': BsKanbanFill,
  'ideas': FaLightbulb,
  'checklists': FaCheckCircle,
  'nps': IoSpeedometer,
  'segments': FaUsers,
  'goals': IoFlag,
  'themes': IoColorPalette,
  'settings': IoSettingsSharp,
  'help': IoHelpCircleSharp
}

export interface SidebarLinkProps {
  href: string;
  name: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, name }) => {

  const router = useRouter();
  // is href contained in asPath
  const isActive = router.asPath.toString().includes(href);
  // const isActive = router.asPath.toString() === href;
  const isActivee=false;

  const widthOfActiveBar='5px';
  let iconLeftMargin='10px';

  if (isActive){
    iconLeftMargin='5px';
  }

  return (
    <Link
      href={href}
      color={isActive? 'blue.600' : 'gray.600'}
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
        background: 'gray.100'
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
            as={icons[name.toLowerCase()]}
            alignSelf={'center'}
            fontSize={'md'}
            marginLeft={iconLeftMargin} />
          <Box
            py={'10px'}
            // fontWeight={'semibold'}
            px={'8px'}>
            {name}
          </Box>
        </Flex>
      </NextLink>
    </Link>
  );
}

export default SidebarLink;
