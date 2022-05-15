import type { NextPage } from 'next';
import Head from 'next/head';

// TODO: tailwind ui vs chakra ui
// -- headless ui
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Roadmap App</title>
        <meta name="description" content="Roadmap software for your project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to Roadmap App
        </h1>
      </main>
    </div>
  );
}

export default Home;
