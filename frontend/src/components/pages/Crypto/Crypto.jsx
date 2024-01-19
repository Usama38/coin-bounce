import { useState, useEffect } from "react";
import styles from "./Crypto.module.css";
import { getCrypto } from "../../../api/external";
import Loader from "../../Loader/Loader";
function Crypto() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async function cryptoApiCall() {
      const response = await getCrypto();
      setData(response);
    })();

    setData([]);
  }, []);
  if (data?.length === 0) {
    return <Loader text="Cryptocurrencies" />;
  }
  if (data?.length === undefined) {
    return <h3>Cryptocurrencies Data not available</h3>;
  }
  const negativeStyle = {
    color: "#ea3943",
  };

  const positiveStyle = {
    color: "#16c784",
  };

  //   const color = {
  //     positiveStyle: "#16c784",
  //     negativeStyle: "#ea3943",
  //   };
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.head}>
          <th>#</th>
          <th>Coin</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>24h</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((coin) => (
          <tr id={coin.id} className={styles.tableRow}>
            <td>{coin.market_cap_rank}</td>
            <td>
              <div className={styles.logo}>
                <img src={coin.image} alt="logo" height={40} width={40} />
                {coin.name}
              </div>
            </td>
            <td>
              <div className={styles.symbol}>{coin.symbol}</div>
            </td>
            <td>{coin.current_price}</td>
            <td
              style={
                coin.price_change_percentage_24h < 0
                  ? negativeStyle
                  : positiveStyle
              }
            >
              {coin.price_change_percentage_24h}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default Crypto;
