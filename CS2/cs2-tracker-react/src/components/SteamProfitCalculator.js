import { useState, useMemo } from "react";
import "./SteamProfitCalculator.css";

export default function SteamProfitCalculator({ isOpen, onClose }) {
  const [totalMoney, setTotalMoney] = useState(100);
  const [targetProfit, setTargetProfit] = useState(30);
  const [itemPrice, setItemPrice] = useState(10);

  const STEAM_RATE = 0.87;

  const result = useMemo(() => {
    if (itemPrice <= 0 || totalMoney <= 0) return null;

    const itemCount = Math.floor(totalMoney / itemPrice);
    if (itemCount === 0) return null;

    const profitPerItem = targetProfit / itemCount;
    const steamSellPrice = (itemPrice + profitPerItem) / STEAM_RATE;

    return {
      itemCount,
      profitPerItem,
      steamSellPrice,
    };
  }, [totalMoney, targetProfit, itemPrice]);

  if (!isOpen) return null;

  return (
    <div className="steam-calc-overlay" onClick={onClose}>
      <div className="steam-calc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="steam-calc-close" onClick={onClose}>×</button>
        
        <div style={{ maxWidth: 420, padding: 20 }}>
          <h2>Steam Item Kâr Hesaplayıcı</h2>

          <label>
            Toplam Para ($)
            <input
              type="number"
              value={totalMoney}
              onChange={(e) => setTotalMoney(Number(e.target.value))}
            />
          </label>

          <br />

          <label>
            Toplam Hedef Kâr ($)
            <input
              type="number"
              value={targetProfit}
              onChange={(e) => setTargetProfit(Number(e.target.value))}
            />
          </label>

          <br />

          <label>
            Item Alış Fiyatı Bynogame ($)
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(Number(e.target.value))}
            />
          </label>

          <hr />

          {result ? (
            <>
              <p>🧾 Alınabilecek Item Sayısı(Not important): <b>{result.itemCount}</b></p>
              <p>💰 Item Başına Net Kâr(not important): <b>{result.profitPerItem.toFixed(2)} $</b></p>
              <p>
                🏷️ Steam Minimum Satış Fiyatı:{" "}
                <b>{result.steamSellPrice.toFixed(2)} $</b>
              </p>
              <small>
                * Steam satışlarından %13 komisyon kesilir (%87 sana geçer)
              </small>
            </>
          ) : (
            <p>❌ Bu değerlerle hesaplama yapılamıyor</p>
          )}
        </div>
      </div>
    </div>
  );
}
