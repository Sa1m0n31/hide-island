import React from 'react'
import PanelMenu from "../components/PanelMenu";
import AddOrderContent from "../components/AddOrderContent";

const AddOrderPage = () => {
    return <main className="panel">
        <PanelMenu active={12} />
        <AddOrderContent />
    </main>
}

export default AddOrderPage;
