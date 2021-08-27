import React, { useState, useEffect } from "react";
import {getAllProducts} from "../helpers/productFunctions";
import {addStock, getProductsWithStock, getSingleStock, updateStock} from "../helpers/stockFunctions";
import {useLocation} from "react-router";

const AddStockContent = () => {
    const [size1, setSize1] = useState("");
    const [size2, setSize2] = useState("");
    const [size3, setSize3] = useState("");
    const [size4, setSize4] = useState("");
    const [size5, setSize5] = useState("");

    const [stock1, setStock1] = useState(0);
    const [stock2, setStock2] = useState(0);
    const [stock3, setStock3] = useState(0);
    const [stock4, setStock4] = useState(0);
    const [stock5, setStock5] = useState(0);

    const [added, setAdded] = useState("");
    const [id, setId] = useState(-1);
    const [title, setTitle] = useState("");
    const [update, setUpdate] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsAdded, setProductsAdded] = useState([]);

    const location = useLocation();

    useEffect(() => {
        /* Check if update mode */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            /* UPDATE MODE */
            setId(param);

            getSingleStock(param)
                .then(res => {
                   if(res?.data?.result) {
                       setUpdate(true);
                       const result = res.data.result;

                       setTitle(result.name);

                       setSize1(result.size_1_name);
                       setSize2(result.size_2_name);
                       setSize3(result.size_3_name);
                       setSize4(result.size_4_name);
                       setSize5(result.size_5_name);

                       setStock1(result.size_1_stock);
                       setStock2(result.size_2_stock);
                       setStock3(result.size_3_stock);
                       setStock4(result.size_4_stock);
                       setStock5(result.size_5_stock);
                   }
                });

            /* Get all products */
            getAllProducts()
                .then(res => {
                    if(res?.data?.result) {
                        console.log(res.data.result);
                        setProducts(res.data.result);
                        setProductsAdded(res.data.result.map((item) => {
                            return {
                                id: item.id,
                                added: item.stock_id === param
                            }
                        }));
                    }
                });
        }
        else {
            /* ADD MODE */
            /* Get all products */
            getAllProducts()
                .then(res => {
                    if(res?.data?.result) {
                        setProducts(res.data.result);
                        setProductsAdded(res.data.result.map((item) => {
                            return {
                                id: item.id,
                                added: false
                            }
                        }));
                    }
                });
        }
    }, []);

    const isElementInArray = (arr, el) => {
        return arr.findIndex((item) => {
            console.log(item.id);
            return item.id === el;
        }) !== -1;
    }

    const toggleProduct = (n) => {
        setProductsAdded(productsAdded.map((item, index) => {
            if(index === n) {
                return {
                    id: item.id,
                    added: !item.added
                }
            }
            else return item;
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const values = {
            products: productsAdded.filter((item) => {
                return item.added;
            }).map((item) => {
                return item.id;
            }),
            id: id,
            name: title,
            size1Name: size1,
            size2Name: size2,
            size3Name: size3,
            size4Name: size4,
            size5Name: size5,
            size1Stock: stock1,
            size2Stock: stock2,
            size3Stock: stock3,
            size4Stock: stock4,
            size5Stock: stock5
        }

        if(update) {
            updateStock(values)
                .then(res => {
                    setAdded("Stan magazynowy został zaktualizowany");
                });
        }
        else {
            addStock(values)
                .then(res => {
                    setAdded("Dodano stan magazynowy");
                });
        }
    }

    return <main className="panelContent addProduct addProduct--stock">
        <header className="addProduct__header">
            <h1 className="addProduct__header__h">
                Edycja stanu magazynowego
            </h1>
        </header>
        <main>
            <form className="stockForm">
                <label className="stockTitleLabel">
                    Nazwa stanu magazynowego
                    <input className="stockTitleInput"
                           placeholder="Nazwa"
                           type="text"
                           value={title}
                           onChange={e => { setTitle(e.target.value); }} />
                </label>
                <section className="addProduct__form__subsection">
                    {/* Sizes and stocks */}
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne rozmiary
                    </h4>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size1"
                               type="text"
                               value={size1}
                               onChange={(e) => { setSize1(e.target.value) }}
                               placeholder="Pierwszy rozmiar" />
                        <input className="addProduct__input"
                               name="size1Stock"
                               type="number"
                               value={stock1}
                               onChange={(e) => { setStock1(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size2"
                               type="text"
                               value={size2}
                               onChange={(e) => { setSize2(e.target.value) }}
                               placeholder="Drugi rozmiar" />
                        <input className="addProduct__input"
                               name="size2Stock"
                               type="number"
                               value={stock2}
                               onChange={(e) => { setStock2(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size3"
                               type="text"
                               value={size3}
                               onChange={(e) => { setSize3(e.target.value) }}
                               placeholder="Trzeci rozmiar" />
                        <input className="addProduct__input"
                               name="size3Stock"
                               type="number"
                               value={stock3}
                               onChange={(e) => { setStock3(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size4"
                               type="text"
                               value={size4}
                               onChange={(e) => { setSize4(e.target.value) }}
                               placeholder="Czwarty rozmiar" />
                        <input className="addProduct__input"
                               name="size4Stock"
                               type="number"
                               value={stock4}
                               onChange={(e) => { setStock4(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size5"
                               type="text"
                               value={size5}
                               onChange={(e) => { setSize5(e.target.value) }}
                               placeholder="Piąty rozmiar" />
                        <input className="addProduct__input"
                               name="size5Stock"
                               type="number"
                               value={stock5}
                               onChange={(e) => { setStock5(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                </section>

                <section className="chooseProducts">
                    {/* Products */}
                    <h4 className="addProduct__form__subsection__header marginBottom40">
                        Wybierz produkty
                    </h4>
                    <main className="productList">
                        {products.map((item, index) => {
                            return <label className="panelContent__filters__label__label panelContent__filters__label__label--category panelContent--productList__item">
                                <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); toggleProduct(index); }}>
                                    <span className={productsAdded[index]?.added ? "panelContent__filters__btn--active" : "d-none"} />
                                </button>
                                {item.name}
                            </label>
                        })}
                    </main>
                </section>

                {added === "" ? <button className="addProduct__btn" onClick={(e) => { handleSubmit(e); }}>
                    {update ? "Aktualizuj stan magazynowy" : "Dodaj stan magazynowy"}
                </button> : <h4 className="infoHeader infoHeader--stock">
                    {added}
                </h4> }
            </form>
        </main>
    </main>
}

export default AddStockContent;
