import {
  Flex,
  Divider
} from '@chakra-ui/react';

import { useRouter } from 'next/router';

import Logo from './Logo';
import SidebarLink from './SidebarLink';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { orgname } = router.query;

  return (
    <Flex
      as={'aside'}
      minHeight={'100vh'}
      height={'100vh'}
      position={'sticky'}
      flex={'0 0 auto'}
      top={'0%'}
      bottom={'0%'}
      align={'center'}
      // border={'2px solid transparent'}
      // TODO change ^
      border={'1px solid transparent'}
      borderRightColor={'blackAlpha.50'}
      borderLeft={'none'}
      flexDirection={'column'}
      paddingTop={'15px'}
      width={'202px'}
      // TODO change ^
      // width={'215px'}
      background={'gray.20'}
      // TODO change ^
      // background={'white'}
    >

      <Flex
        // logo area
        align={'center'}
        // border={'1px solid blue'}
        flexDirection={'column'}
        width={'100%'}
        marginBottom={'10px'}
        justify={'center'}>
        <Logo />
      </Flex>

      <Flex
        // links
        align={'center'}
        //TODO remove padding
        // padding={'7.5px'}
        flexDirection={'column'}
        width={'100%'}
        py={'10px'}
        height={'100%'}
        justifyContent={'space-between'}
        justify={'center'}>
        <Flex
          // main links
          // border={'1px solid red'}
          align={'center'}
          flexDirection={'column'}
          width={'100%'}
          justify={'center'}>

          <SidebarLink
            href={`/${orgname}/roadmap`}
            name={'Roadmap'} />
          <Divider my={'1rem'} color={'red'} />
          <SidebarLink
            href={`/${orgname}/ideas`}
            name={'Ideas'} />
          <SidebarLink
            href={`/${orgname}/boards`}
            name={'Boards'} />
          <SidebarLink
            href={`/${orgname}/nps`}
            name={'NPS'} />
          <Divider my={'1rem'} color={'red'} />
          <SidebarLink
            href={`/${orgname}/segments`}
            name={'Segments'} />
          <SidebarLink
            href={`/${orgname}/goals`}
            name={'Goals'} />
          <SidebarLink
            href={`/${orgname}/themes`}
            name={'Themes'} />
        </Flex>
        <Flex
          // misc links
          flexDirection={'column'}
          align={'center'}
          width={'100%'}
          justify={'center'}>
          <SidebarLink
            href={`/${orgname}/settings`}
            name={'Settings'} />
          <SidebarLink
            href={'/help'}
            name={'Help'} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Sidebar;
