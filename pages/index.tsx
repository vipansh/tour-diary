import Head from "next/head";
import { TabelData, Header } from "../components";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tour Diary</title>
        <meta name="description" content="Prepare and print reviewed Tour Diary and TR7 records." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <TabelData />
    </>
  );
}
