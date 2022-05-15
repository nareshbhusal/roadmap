import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app';

import { ReactNode } from 'react';
import { NextPageWithLayout } from '../types/page';
import modifiedTheme from '../theme';

export type Props = AppProps & {
  Component: NextPageWithLayout;
};


const App = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
      <ChakraProvider theme={modifiedTheme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
  );
};

export default App;
