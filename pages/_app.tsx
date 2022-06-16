import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app';

import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/600.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/500.css'
import '@fontsource/open-sans/700.css'
import '../styles/global.css';

import { ReactNode } from 'react';
import { NextPageWithLayout } from '../types/page';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import modifiedTheme from '../theme';
import { db } from '../db';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export type Props = AppProps & {
  Component: NextPageWithLayout;
};

// TODO: Redirect /[orgname]/ to /[orgname]/roadmap/

const App = ({ Component, pageProps }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const router = useRouter();
  const publicRoutes = ['/', '/register'];

  useEffect(() => {

    (async () => {
      const { user, organization } = await db.getRegisterationInfo();
      const isLoggedIn = !!user && !!organization;
      setIsAuthenticated(isLoggedIn);

      const isPublicRoute = publicRoutes.includes(router.pathname);

      if (isPublicRoute && isLoggedIn) {
        router.push(`/${organization.urlKey}/ideas`);
      } else if (!isPublicRoute && !isLoggedIn) {
        router.push('/register');
      } else if (!isPublicRoute && isLoggedIn && router.query.orgname !== organization.urlKey && router.isReady) {
        router.push(`/${organization.urlKey}/ideas`);
      }
    })();
  }, [router.pathname, router.isReady]);

  if (!pageProps.public && !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return (
    <DndProvider backend={HTML5Backend}>
      <ChakraProvider theme={modifiedTheme}>
          {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </DndProvider>
  );
};

export const getStaticProps = () => {
  console.log(useRouter())
}

export default App;
