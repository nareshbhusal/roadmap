import Head from 'next/head';
import Layout from '../../../layouts/layout';
import { NextPageWithLayout } from '../../../types/page';

const Ideas: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Ideas | Roadmap App</title>
      </Head>

      <main>
      </main>
    </div>
  );
}

Ideas.getLayout = (page: any) => {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default Ideas;
