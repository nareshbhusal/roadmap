import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app';


export type Props = AppProps & {
  Component: React.ComponentType<any>;
}

function MyApp({ Component, pageProps }: Props) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp;
