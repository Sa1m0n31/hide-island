import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelNewsletterContent from "../components/PanelNewsletterContent";

const NewsletterPage = () => {
    return <main className="panel">
        <PanelMenu active={10} />
        <PanelNewsletterContent />
    </main>
}

export default NewsletterPage;
