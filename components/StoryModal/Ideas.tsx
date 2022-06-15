import { Stack, Flex, Heading, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

// TODO: Styles the ideas better

const Ideas: React.FC<any> = ({ ideas }) => {
  const router = useRouter();
  const { orgname } = router.query;
  return (
    <Stack spacing={'10px'}>
      <Heading
        fontWeight={'semibold'}
        fontSize={'15px'}>
        Ideas
      </Heading>
      <Flex
        marginTop={'10px'}>
        <Flex
          flexDirection={'column'}
          width={'auto'}
          justifyContent={'flex-left'}>
          {ideas.map((idea: any) => {
            const url = `/${orgname}/ideas/${idea.id}/edit`;
            return (
              <Flex
                key={idea.id}
                marginBottom={'5px'}>
                <NextLink
                  color={'blue'}
                  href={url}>
                  {idea.title}
                </NextLink>
              </Flex>
            )}
          )}
          {ideas.length === 0 ?
            <Text
              color={'gray.600'}
              fontSize={'xs'}
              marginTop={'10px'}>
              No ideas linked yet
            </Text> :
            null}
        </Flex>
      </Flex>
    </Stack>
  );
}

export default Ideas;
