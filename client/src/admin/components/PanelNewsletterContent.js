import React, {useEffect, useState} from "react";
import axios from "axios";
import settings from "../helpers/settings";

const PanelNewsletterContent = () => {
    const [subscribers, setSubscribers] = useState([]);

    useEffect(() => {
        axios.get(`${settings.API_URL}/newsletter/get-all`)
            .then(res => {
               const result = res.data?.result;
               if(result) setSubscribers(result);
            });
    }, []);

    return <main className="panelContent">
        <section className="panelContent__frame__section categoryList">
            <h1 className="panelContent__frame__header">
                Lista subskrybentów newslettera
            </h1>

            <main className="panelContent__content">
                {subscribers?.map((item, index) => (
                    <section className="panelContent__item productItem">
                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Id
                            </h4>
                            <h3 className="panelContent__column__value">
                                {item.id}
                            </h3>
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Adres email
                            </h4>
                            <h3 className="panelContent__column__value">
                                {item.email}
                            </h3>
                        </section>
                    </section>
                ))}
            </main>
        </section>
    </main>
}

export default PanelNewsletterContent;
