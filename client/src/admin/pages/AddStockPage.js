import React from 'react'
import PanelMenu from "../components/PanelMenu";
import AddStockContent from "../components/AddStockContent";

const AddStockPage = () => {
    return <main className="panel">
        <PanelMenu active={2} submenu={true} />
        <AddStockContent />
    </main>
}

export default AddStockPage;
