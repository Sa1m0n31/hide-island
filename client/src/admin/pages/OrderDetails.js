import React from 'react'

import PanelMenu from "../components/PanelMenu";
import OrderDetailsContent from "../components/OrderDetailsContent";

const OrderDetails = () => {
    return <>
        <PanelMenu active={3} />
        <OrderDetailsContent />
    </>
}

export default OrderDetails;
