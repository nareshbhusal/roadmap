import { Stack, Flex, FormLabel, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineLink } from 'react-icons/ai';

const Ideas: React.FC<any> = ({ ideas }) => {
  const router = useRouter();
  const { orgname } = router.query;
  return (
    <Stack>
      <FormLabel
        requiredIndicator={<Text></Text>}
        variant={'small'}
        htmlFor="ideas">
        Ideas
      </FormLabel>
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
                marginBottom={'8px'}>
                <NextLink
                  color={'blue'}
                  href={url}>
                  <a>
                    <Flex alignItems={'center'}>
                      <AiOutlineLink />
                      <Text ml={'3px'}>
                        {idea.title}
                      </Text>
                    </Flex>
                  </a>
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
