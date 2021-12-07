import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState, useCallback } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState('unknown');
  const [backing, setBacking] = useState('unknown');

  const fetchPrice = useCallback(async () => {
    setLoading(true);

    const body = {
      variables: {},
      query:
        '{\n  protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {\n    id\n    timestamp\n    ohmCirculatingSupply\n    sOhmCirculatingSupply\n    totalSupply\n    ohmPrice\n    marketCap\n    totalValueLocked\n    treasuryRiskFreeValue\n    treasuryMarketValue\n    nextEpochRebase\n    nextDistributedOhm\n    treasuryDaiRiskFreeValue\n    treasuryFraxMarketValue\n    treasuryDaiMarketValue\n    treasuryFraxRiskFreeValue\n    treasuryXsushiMarketValue\n    treasuryWETHMarketValue\n    treasuryLusdRiskFreeValue\n    treasuryLusdMarketValue\n    currentAPY\n    runway10k\n    runway20k\n    runway50k\n    runway7dot5k\n    runway5k\n    runway2dot5k\n    runwayCurrent\n    holders\n    treasuryOhmDaiPOL\n    treasuryOhmFraxPOL\n    __typename\n  }\n}\n',
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    const response = await fetch(
      'https://api.thegraph.com/subgraphs/name/drondin/olympus-graph',
      requestOptions
    );
    const result = await response.json();

    const parsedPrice = Number(result?.data?.protocolMetrics[0]?.ohmPrice);
    const parsedSupply = Number(result?.data?.protocolMetrics[0]?.ohmCirculatingSupply);
    const parsedMarketValue = Number(result?.data?.protocolMetrics[0]?.treasuryMarketValue);
    const allResultsPresent = parsedPrice && parsedSupply && parsedMarketValue;

    if (allResultsPresent) {
      const twoDecimalPrice = Math.round(parsedPrice * 100) / 100;
      setPrice(String(twoDecimalPrice));

      const backingPrice = parsedMarketValue / parsedSupply;
      const twoDecimalBackingPrice = Math.round(backingPrice * 100) / 100;
      setBacking(twoDecimalBackingPrice);
    } else {
      setPrice('still unknown');
      setBacking('still unknown');
    }
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return (
    <div className={styles.container}>
      <Head>
        <title>OHM prices</title>
        <meta name="description" content="OHM prices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to OHM price monitor!</h1>
        <p className={styles.description}>
          I am Hukus and I am trying to get the abachi.io whitelist :D
        </p>
        <button onClick={fetchPrice}>Fetch Prices</button>
        <p>
          Current price: <b>${loading ? 'fetching...' : price}</b>
        </p>
        <p>
          Current backing: <b>${loading ? 'fetching...' : backing}</b>
        </p>
      </main>
    </div>
  );
}
