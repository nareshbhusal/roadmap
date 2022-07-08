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
import Lusift from 'lusift/dev/react';
import lusiftContent from '../lusift/content';

// TODO: Add spinners

export type Props = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const router = useRouter();
  const publicRoutes = ['/', '/register'];

  useEffect(() => {

    (async () => {
      const { user, organization } = await db.getRegisterationInfo();
      const lastAccessedBoard = await db.getLastAccessedBoard();
      const isLoggedIn = !!user && !!organization;
      setIsAuthenticated(isLoggedIn);

      const isPublicRoute = publicRoutes.includes(router.pathname);

      if (isPublicRoute && isLoggedIn) {
        if (lastAccessedBoard) {
          router.push(`/${organization.urlKey}/roadmap/${lastAccessedBoard}`);
        } else {
          router.push(`/${organization.urlKey}/boards`);
        }
      } else if (!isPublicRoute && !isLoggedIn) {
        router.push('/register');
      } else if (!isPublicRoute && isLoggedIn && router.query.orgname !== organization.urlKey && router.isReady) {
        if (lastAccessedBoard) {
          router.push(`/${organization.urlKey}/roadmap/${lastAccessedBoard}`);
        } else {
          router.push(`/${organization.urlKey}/boards`);
        }
      } else if (isPublicRoute && !isLoggedIn) {
        if (router.pathname === '/') {
          router.push('/register');
        }
      }
    })();
    // Lusift.setContent(lusiftContent);
    // Lusift.showContent('guide1');
  }, [router.pathname, router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {

    const defaultC = {
      tooltip: {
        actions: {
          navSection: {
            dismissLink: {
              text: 'skip this one',
              disabled: false,
            }
          }
        }
      }
    }

    Lusift.setContent(lusiftContent, defaultC);
    Lusift.showContent('guide1');
    router.events.on('routeChangeComplete', () => {
      (window['Lusift' as any] as any).refresh();
      console.log('routeChangeComplete')
    });
    // Lusift.refresh();
    setTimeout(Lusift.refresh, 500);
  }, []);

  if (!pageProps.public && !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return (
    <ChakraProvider theme={modifiedTheme}>
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
};

export const getStaticProps = () => {
}

export default App;
