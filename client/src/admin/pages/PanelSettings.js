import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelSettingsContent from "../components/PanelSettingsContent";

const PanelSettings = () => {
    return <main className="panel">
        <PanelMenu active={7} />
        <PanelSettingsContent />
    </main>
}

export default PanelSettings;
