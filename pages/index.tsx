import type { NextPage } from 'next';
import Head from 'next/head';

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

export const getStaticProps = async (context: any) => {
  return {
    props: {
      public: true
    }
  }
}

export default Home;
