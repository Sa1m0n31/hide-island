import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelNewsletterContent from "../components/PanelNewsletterContent";

const NewsletterPage = () => {
    return <main className="panel">
        <PanelMenu active={11} />
        <PanelNewsletterContent />
    </main>
}

export default NewsletterPage;
