import React from "react";
import PanelMenu from "../components/PanelMenu";
import PanelImagesContent from "../components/PanelImagesContent";

const PanelImages = () => {
    return <main className="panel">
        <PanelMenu active={8} />
        <PanelImagesContent />
    </main>
}

export default PanelImages;
