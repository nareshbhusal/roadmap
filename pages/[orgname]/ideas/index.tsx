import type { NextPage } from 'next';
import Head from 'next/head';
import Logo from '../../../components/Logo';

const Ideas: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Ideas | Roadmap App</title>
      </Head>

      <main>
        <Logo />
        <h1>
          Ideas page
        </h1>
      </main>
    </div>
  );
}

export default Ideas;
