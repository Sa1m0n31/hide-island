import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelCouponsContent from "../components/PanelCouponsContent";

const PanelCoupons = () => {
    return <main className="panel">
        <PanelMenu active={7} />
        <PanelCouponsContent />
    </main>
}

export default PanelCoupons;
