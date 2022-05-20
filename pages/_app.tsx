import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app';

import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/600.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/500.css'
import '@fontsource/open-sans/700.css'

import { ReactNode } from 'react';
import { NextPageWithLayout } from '../types/page';
import modifiedTheme from '../theme';

export type Props = AppProps & {
  Component: NextPageWithLayout;
};

// TODO: Model the data
// -- Model the entire db
// -- Model for redux and then for the views

const App = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

//   return <Component {...pageProps} />

  return (
      <ChakraProvider theme={modifiedTheme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
  );
};

export default App;
