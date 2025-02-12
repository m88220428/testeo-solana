import { useState } from "react";
import { Card } from "./ui/card";
import { useEditor } from "@/contexts/EditorContext";
import { Input } from "./ui/input";
import WalletSection from "./presale/WalletSection";
import NowPaymentsSection from "./presale/NowPaymentsSection";

const SUPPORTED_TOKENS = {
  SOL: { symbol: "SOL", name: "Solana", decimals: 9 },
  USDT: { symbol: "USDT", name: "USDT (SPL)", decimals: 6 },
  USDC: { symbol: "USDC", name: "USDC (SPL)", decimals: 6 },
};

const PresaleWidget = () => {
  const { isEditing } = useEditor();
  const [walletAmount, setWalletAmount] = useState("");
  const [nowPaymentsAmount, setNowPaymentsAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("SOL");
  const [tokenSymbol, setTokenSymbol] = useState("$VVTRUMP");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [tokenPrice, setTokenPrice] = useState({
    SOL: "0.05",
    USDT: "1.00",
    USDC: "1.00"
  });

  return (
    <Card className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl border-2 border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all w-full max-w-md ml-auto mr-[50px] mt-[50px]">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">Token Presale</h3>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-gray-400">Token Symbol:</span>
                  <Input
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white w-32 text-center"
                  />
                </div>
                
                <div className="grid gap-2">
                  <p className="text-sm text-gray-400 text-center">Token Price per Unit</p>
                  {Object.keys(tokenPrice).map((token) => (
                    <div key={token} className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg">
                      <span className="text-gray-400 min-w-[60px]">{token}:</span>
                      <Input
                        type="text"
                        value={tokenPrice[token as keyof typeof tokenPrice]}
                        onChange={(e) => setTokenPrice(prev => ({...prev, [token]: e.target.value}))}
                        className="bg-gray-800 border-gray-700 text-white text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Input
                type="text"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Enter receiver wallet address"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          ) : (
            <p className="text-gray-400">
              1 {tokenSymbol} = {tokenPrice[selectedToken]} {selectedToken}
            </p>
          )}
        </div>

        <div className="space-y-8">
          <WalletSection
            tokenSymbol={tokenSymbol}
            tokenPrice={tokenPrice}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
            walletAmount={walletAmount}
            setWalletAmount={setWalletAmount}
            receiverAddress={receiverAddress}
            isEditing={isEditing}
          />

          <div className="border-t border-gray-700 pt-6">
            <NowPaymentsSection
              tokenSymbol={tokenSymbol}
              tokenPrice={tokenPrice}
              nowPaymentsAmount={nowPaymentsAmount}
              setNowPaymentsAmount={setNowPaymentsAmount}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PresaleWidget;