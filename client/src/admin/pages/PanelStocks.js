import React from "react";
import PanelMenu from "../components/PanelMenu";
import PanelStocksContent from "../components/PanelStocksContent";

const PanelStocks = () => {
    return <main className="panel">
        <PanelMenu active={2} />
        <PanelStocksContent />
    </main>
}

export default PanelStocks;
