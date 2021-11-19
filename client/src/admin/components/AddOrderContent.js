import React, {useEffect, useState} from 'react'
import tickIcon from "../../static/img/tick-sign.svg";
import arrowLong from "../../static/img/arrow-long.svg";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import settings from "../../helpers/settings";
import auth from "../helpers/auth";
import Modal from "react-modal";
import closeImg from "../../static/img/close.png";
import checkIcon from '../../static/img/tick-sign.svg'
import GeolocationWidget from "../../components/GeolocationWidget";
import {getAllProducts, getProductSizes} from "../helpers/productFunctions";

const AddOrderContent = () => {
    const [vat, setVat] = useState(false);
    const [shippingMethod, setShippingMethod] = useState(-1);
    const [paymentMethod, setPaymentMethod] = useState(-1);
    const [shippingCost, setShippingCost] = useState(0);
    const [amount, setAmount] = useState(shippingCost);
    const [isAuth, setIsAuth] = useState(false);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [inPostModal, setInPostModal] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [street, setStreet] = useState("");
    const [building, setBuilding] = useState("");
    const [flat, setFlat] = useState("");
    const [coupon, setCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponVerified, setCouponVerified] = useState(-1);
    const [discount, setDiscount] = useState("");
    const [accountExistsError, setAccountExistsError] = useState("");
    const [inPostAddress, setInPostAddress] = useState("");
    const [inPostCode, setInPostCode] = useState("");
    const [inPostCity, setInPostCity] = useState("");
    const [discountInPLN, setDiscountInPLN] = useState(0);
    const [sum, setSum] = useState(0);
    const [products, setProducts] = useState([]);
    const [productsAdded, setProductsAdded] = useState([]);
    const [cart, setCart] = useState([]);
    const [success, setSuccess] = useState(-1);

    const [product1, setProduct1] = useState("");
    const [product2, setProduct2] = useState("");
    const [product3, setProduct3] = useState("");
    const [product4, setProduct4] = useState("");
    const [product5, setProduct5] = useState("");

    const [product1Amount, setProduct1Amount] = useState(1);
    const [product2Amount, setProduct2Amount] = useState(1);
    const [product3Amount, setProduct3Amount] = useState(1);
    const [product4Amount, setProduct4Amount] = useState(1);
    const [product5Amount, setProduct5Amount] = useState(1);

    const [product1Size, setProduct1Size] = useState("Wybierz rozmiar");
    const [product2Size, setProduct2Size] = useState("Wybierz rozmiar");
    const [product3Size, setProduct3Size] = useState("Wybierz rozmiar");
    const [product4Size, setProduct4Size] = useState("Wybierz rozmiar");
    const [product5Size, setProduct5Size] = useState("Wybierz rozmiar");

    const [product1AvailableSizes, setProduct1AvailableSizes] = useState([]);
    const [product2AvailableSizes, setProduct2AvailableSizes] = useState([]);
    const [product3AvailableSizes, setProduct3AvailableSizes] = useState([]);
    const [product4AvailableSizes, setProduct4AvailableSizes] = useState([]);
    const [product5AvailableSizes, setProduct5AvailableSizes] = useState([]);

    const [product1Added, setProduct1Added] = useState(false);
    const [product2Added, setProduct2Added] = useState(false);
    const [product3Added, setProduct3Added] = useState(false);
    const [product4Added, setProduct4Added] = useState(false);
    const [product5Added, setProduct5Added] = useState(false);

    const [product1Price, setProduct1Price] = useState(0);
    const [product2Price, setProduct2Price] = useState(0);
    const [product3Price, setProduct3Price] = useState(0);
    const [product4Price, setProduct4Price] = useState(0);
    const [product5Price, setProduct5Price] = useState(0);

    Modal.setAppElement(document.getElementById("addOrder"));

    useEffect(() => {
        console.log(cart);
    }, [cart]);

    useEffect(() => {
        window.easyPackAsyncInit = function () {
            window.easyPack.init({
                mapType: 'google',
                searchType: 'osm',
                map: {
                    googleKey: 'AIzaSyAS0nA7DChYpHzv5CVpXM1K4vqYaGNCElw'
                }
            });
            const map = window.easyPack.mapWidget('paczkomatyMapa', function(point) {
                /* Paczkomat zostal wybrany */
                sessionStorage.setItem('paczkomat-id', point.name);
                sessionStorage.setItem('paczkomat-miasto', point.address_details.city);
                sessionStorage.setItem('paczkomat-kod', point.address_details.post_code);
                sessionStorage.setItem('paczkomat-adres', point.address_details.street + " " + point.address_details.building_number);

                const storage = new Event('storage');
                document.dispatchEvent(storage);

                const modal = document.querySelector(".bigModal");
                if(modal) {
                    modal.style.opacity = "0";
                    setTimeout(() => {
                        modal.style.display = "none";
                    }, 500);
                }
            });
        };
    }, [inPostModal]);

    useEffect(() => {
        /* Check if login - then set form data */
        auth(localStorage.getItem('sec-sessionKey'))
            .then(res => {
                if(res.data?.result) {
                    axios.post(`${settings.API_URL}/user/get-user`, {
                        id: parseInt(localStorage.getItem('sec-user-id'))
                    })
                        .then(res => {
                            const result = res.data?.result;
                            if(result) {
                                setIsAuth(true);
                                setEmail(result.email);
                                setFirstName(result.first_name);
                                setLastName(result.last_name);
                                setPhoneNumber(result.phone_number);
                                setCity(result.city);
                                setPostalCode(result.postal_code);
                                setStreet(result.street);
                                setBuilding(result.building);
                                setFlat(result.flat);
                            }
                        });
                }
            });

        /* Check shipping methods */
        axios.get(`${settings.API_URL}/shipping/get-info`)
            .then(res => {
                if(res.data?.result) {
                    setShippingMethods(res.data.result);
                }
            });

        /* Listener */
        document.addEventListener("click", () => {
            setInPostAddress(sessionStorage.getItem('paczkomat-adres'));
            setInPostCode(sessionStorage.getItem('paczkomat-kod'));
            setInPostCity(sessionStorage.getItem('paczkomat-miasto'));
        });

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
    }, []);

    useEffect(() => {
        setAmount(sum + shippingCost);
    }, [shippingMethod]);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Podaj poprawny adres email")
            .required("Wpisz swój adres email"),
        firstName: Yup.string()
            .required("Wpisz swoje imię"),
        lastName: Yup.string()
            .required("Wpisz swoje nazwisko"),
        phoneNumber: Yup.string()
            .matches(/\d{3,}/, 'Numer telefonu może zawierać wyłącznie cyfry')
            .required("Wpisz swój numer telefonu"),
        postalCode: Yup.string()
            .matches(/\d{2}-\d{3}/, "Podaj poprawny kod pocztowy")
            .required("Wpisz swój kod pocztowy"),
        city: Yup.string()
            .required("Wpisz swoją miejscowość"),
        street: Yup.string()
            .required("Wpisz swoją ulicę"),
        building: Yup.string()
            .required("Wpisz numer budynku")
    });

    const formik = useFormik({
        initialValues: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            postalCode: postalCode,
            city: city,
            street: street,
            building: building,
            flat: flat,
            companyName: "",
            nip: "",
            comment: ""
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if((shippingMethod !== -1)&&(paymentMethod !== -1)) {
                const sessionId = uuidv4();

                /* Add user */
                if(1) {
                    axios.post(`${settings.API_URL}/auth/add-user`, {
                        firstName: formik.values.firstName,
                        lastName: formik.values.lastName,
                        email: formik.values.email,
                        phoneNumber: formik.values.phoneNumber,
                        street: formik.values.street,
                        building: formik.values.building,
                        flat: formik.values.flat,
                        city: formik.values.city,
                        postalCode: formik.values.postalCode
                    })
                        .then(res => {
                            if(res.data.result === -1) {
                                setAccountExistsError("Istnieje konto o podanym adresie email. Aby dokonać zakupu, zaloguj się.");
                            }
                            else {
                                addOrder(res, sessionId);
                            }
                        });
                }
            }
        }});

    const addOrder = (res, sessionId) => {
        let insertedUserId = null;

        if(res) insertedUserId = res.data.userId;

        if(1) {
            /* Decrement coupon code times_to_use */
            if(couponVerified === 1) {
                axios.post(`${settings.API_URL}/coupon/decrement`, {
                    couponContent: couponCode
                });
            }

            /* Add order */
            axios.post(`${settings.API_URL}/order/add`, {
                paymentMethod: paymentMethod,
                shippingMethod: shippingMethod,
                city: formik.values.city,
                street: formik.values.street,
                building: formik.values.building,
                flat: formik.values.flat,
                postalCode: formik.values.postalCode,
                user: insertedUserId,
                comment: formik.values.comment,
                sessionId,
                companyName: formik.values.companyName,
                nip: formik.values.nip,
                amount: sum + shippingCost - discountInPLN,
                inPostName: sessionStorage.getItem('paczkomat-id'),
                inPostAddress: sessionStorage.getItem('paczkomat-adres'),
                inPostCode: sessionStorage.getItem('paczkomat-kod'),
                inPostCity: sessionStorage.getItem('paczkomat-miasto')
            })
                .then(res => {
                    const orderId = res.data.result;

                    if(orderId) {
                        /* Add sells */
                        cart?.forEach((item, cartIndex, cartArray) => {
                            /* Add sells */
                            axios.post(`${settings.API_URL}/order/add-sell`, {
                                orderId,
                                productId: item.productId,
                                size: item.size,
                                quantity: item.quantity,
                                paymentMethod: paymentMethod
                            })
                                .then(res => {
                                    if(cartIndex === cartArray.length-1) {
                                        /* PO DODANIU ZAMÓWIENIA */
                                        if(res?.data?.result) setSuccess(1);
                                        else setSuccess(0);
                                        window.scrollTo(0, 0);
                                    }
                                })
                        });
                    }
                    else {
                        window.location = "/";
                    }
                });
        }
    }

    const verifyCoupon = () => {
        axios.post(`${settings.API_URL}/coupon/verify`, {
            code: couponCode
        })
            .then(res => {
                const result = res.data;
                if(result) {
                    if(result.percent) {
                        setCouponVerified(1);
                        setAmount(Math.round(sum - sum * (result.percent / 100)));
                        setDiscount("-" + result.percent + "%");
                        setDiscountInPLN(Math.round(sum * (result.percent / 100)));
                    }
                    else if(result.amount) {
                        setCouponVerified(1);
                        setAmount(sum - result.amount);
                        setDiscount("-" + result.amount + " PLN");
                        setDiscountInPLN(result.amount);
                    }
                    else {
                        setCouponVerified(0);
                    }
                }
                else {
                    setCouponVerified(0);
                }
            });
    }

    useEffect(() => {
        if(couponVerified === 0) {
            setTimeout(() => {
                setCouponVerified(-1);
            }, 2000);
        }
    }, [couponVerified]);

    useEffect(() => {
        getProductSizes(product1)
            .then((res) => {
                const result = res?.data?.result[0];
                if(result) {
                    let availableSizes = [];
                    if(result.size_1_stock) availableSizes.push(result.size_1_name);
                    if(result.size_2_stock) availableSizes.push(result.size_2_name);
                    if(result.size_3_stock) availableSizes.push(result.size_3_name);
                    if(result.size_4_stock) availableSizes.push(result.size_4_name);
                    if(result.size_5_stock) availableSizes.push(result.size_5_name);

                    setProduct1Size(availableSizes[0]);
                    setProduct1AvailableSizes(availableSizes);
                }
            });
    }, [product1]);

    useEffect(() => {
        getProductSizes(product2)
            .then((res) => {
                const result = res?.data?.result[0];
                if(result) {
                    let availableSizes = [];
                    if(result.size_1_stock) availableSizes.push(result.size_1_name);
                    if(result.size_2_stock) availableSizes.push(result.size_2_name);
                    if(result.size_3_stock) availableSizes.push(result.size_3_name);
                    if(result.size_4_stock) availableSizes.push(result.size_4_name);
                    if(result.size_5_stock) availableSizes.push(result.size_5_name);

                    setProduct2Size(availableSizes[0]);
                    setProduct2AvailableSizes(availableSizes);
                }
            });
    }, [product2]);

    useEffect(() => {
        getProductSizes(product3)
            .then((res) => {
                const result = res?.data?.result[0];
                if(result) {
                    let availableSizes = [];
                    if(result.size_1_stock) availableSizes.push(result.size_1_name);
                    if(result.size_2_stock) availableSizes.push(result.size_2_name);
                    if(result.size_3_stock) availableSizes.push(result.size_3_name);
                    if(result.size_4_stock) availableSizes.push(result.size_4_name);
                    if(result.size_5_stock) availableSizes.push(result.size_5_name);

                    setProduct3Size(availableSizes[0]);
                    setProduct3AvailableSizes(availableSizes);
                }
            });
    }, [product3]);

    useEffect(() => {
        getProductSizes(product4)
            .then((res) => {
                const result = res?.data?.result[0];
                if(result) {
                    let availableSizes = [];
                    if(result.size_1_stock) availableSizes.push(result.size_1_name);
                    if(result.size_2_stock) availableSizes.push(result.size_2_name);
                    if(result.size_3_stock) availableSizes.push(result.size_3_name);
                    if(result.size_4_stock) availableSizes.push(result.size_4_name);
                    if(result.size_5_stock) availableSizes.push(result.size_5_name);

                    setProduct4Size(availableSizes[0]);
                    setProduct4AvailableSizes(availableSizes);
                }
            });
    }, [product4]);

    useEffect(() => {
        getProductSizes(product5)
            .then((res) => {
                const result = res?.data?.result[0];
                if(result) {
                    let availableSizes = [];
                    if(result.size_1_stock) availableSizes.push(result.size_1_name);
                    if(result.size_2_stock) availableSizes.push(result.size_2_name);
                    if(result.size_3_stock) availableSizes.push(result.size_3_name);
                    if(result.size_4_stock) availableSizes.push(result.size_4_name);
                    if(result.size_5_stock) availableSizes.push(result.size_5_name);

                    setProduct5Size(availableSizes[0]);
                    setProduct5AvailableSizes(availableSizes);
                }
            });
    }, [product5]);

    const addProductToCart = (n) => {
        switch (n) {
            case 1:
                setProduct1Added(true);
                setCart([...cart, {
                    index: n-1,
                    productId: parseInt(product1),
                    size: product1Size,
                    quantity: parseInt(product1Amount.toString()),
                    price: product1Price
                }]);
                break;
            case 2:
                setProduct2Added(true);
                setCart([...cart, {
                    index: n-1,
                    productId: parseInt(product2),
                    size: product2Size,
                    quantity: parseInt(product2Amount.toString()),
                    price: product2Price
                }]);
                break;
            case 3:
                setProduct3Added(true);
                setCart([...cart, {
                    index: n-1,
                    productId: parseInt(product3),
                    size: product3Size,
                    quantity: parseInt(product3Amount.toString()),
                    price: product3Price
                }]);
                break;
            case 4:
                setProduct4Added(true);
                setCart([...cart, {
                    index: n-1,
                    productId: parseInt(product4),
                    size: product4Size,
                    quantity: parseInt(product4Amount.toString()),
                    price: product4Price
                }]);
                break;
            case 5:
                setProduct5Added(true);
                setCart([...cart, {
                    index: n-1,
                    productId: parseInt(product5),
                    size: product5Size,
                    quantity: parseInt(product5Amount.toString()),
                    price: product5Price
                }]);
                break;
            default:
                break;
        }
    }

    const removeProductFromCart = (n) => {
        setCart(cart.filter((item) => {
            return item.index !== n-1;
        }));
        switch(n) {
            case 1:
                setProduct1Added(false);
                break;
            case 2:
                setProduct2Added(false);
                break;
            case 3:
                setProduct3Added(false);
                break;
            case 4:
                setProduct4Added(false);
                break;
            case 5:
                setProduct5Added(false);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        setSum((cart.reduce((prev, item) => {
            return prev + parseFloat(item.price.toString()) * item.quantity;
        }, 0)).toFixed(2));
    }, [cart]);

    return <main className="panelContent panelContent--addOrder" id="addOrder">
        <Modal
            isOpen={inPostModal}
            portalClassName="smallModal bigModal"
            onRequestClose={() => { setInPostModal(false) }}
        >

            <button className="modalClose" onClick={() => { setInPostModal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>

            <GeolocationWidget />
        </Modal>

        {success === -1 ? <>
            <h2 className="cart__header">
                Dodaj nowe zamówienie
            </h2>
            <section className="shippingForm__products">
                <h3 className="clientForm__subheader">
                    Wybierz produkty
                </h3>
                <main className="productList">
                    <h5 className="productList__item__header">
                        Produkt 1.
                    </h5>
                    <section className="productList__item d-flex">
                        <select value={product1 + '-' + product1Price} onChange={(e) => { setProduct1(e.target.value.split('-')[0]); setProduct1Price(e.target.value.split('-')[1]); }}>
                            {!product1 ? <option>
                                Wybierz produkt
                            </option> : ""}
                            {products.map((item, index) => {
                                return <option key={index} value={item.id + '-' + item.price}>
                                    {item.name}
                                </option>
                            })}
                        </select>
                        <label className="ml-3">
                            Ilość
                            <select value={product1Amount}
                                    onChange={(e) => { setProduct1Amount(e.target.value); }}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </label>
                        <label className="d-block ml-3">
                            Rozmiar
                            <select value={product1Size}
                                    onChange={(e) => { setProduct1Size(e.target.value); }}>
                                {!product1AvailableSizes.length ? <option>
                                    Wybierz rozmiar
                                </option> : ""}
                                {product1AvailableSizes.map((item, index) => {
                                    return <option key={index} value={item}>
                                        {item}
                                    </option>
                                })}
                            </select>
                        </label>
                        {!product1Added && product1 && product1Size ? <button className="productList__btn" onClick={() => { addProductToCart(1); }}>
                            Dodaj produkt
                        </button> : (product1Added ? <div className="productList__productAddedWrapper">
                            <img className="productList__icon" src={tickIcon} alt="ok" />
                            <h3 className="productList__productAdded">
                                Produkt został dodany
                            </h3>
                            <button className="productList__btn" onClick={() => { removeProductFromCart(1); }}>
                                Usuń produkt
                            </button>
                        </div> : "")}
                    </section>
                    <h5 className="productList__item__header">
                        Produkt 2.
                    </h5>
                    <section className="productList__item d-flex">
                        <select value={product2 + '-' + product2Price} onChange={(e) => { setProduct2(e.target.value.split('-')[0]); setProduct2Price(e.target.value.split('-')[1]); }}>
                            {!product2 ? <option>
                                Wybierz produkt
                            </option> : ""}
                            {products.map((item, index) => {
                                return <option key={index} value={item.id + '-' + item.price}>
                                    {item.name}
                                </option>
                            })}
                        </select>
                        <label className="ml-3">
                            Ilość
                            <select value={product2Amount}
                                    onChange={(e) => { setProduct2Amount(e.target.value); }}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </label>
                        <label className="d-block ml-3">
                            Rozmiar
                            <select value={product2Size}
                                    onChange={(e) => { setProduct2Size(e.target.value); }}>
                                {!product2AvailableSizes.length ? <option>
                                    Wybierz rozmiar
                                </option> : ""}
                                {product2AvailableSizes.map((item, index) => {
                                    return <option key={index} value={item}>
                                        {item}
                                    </option>
                                })}
                            </select>
                        </label>
                        {!product2Added && product2 && product2Size ? <button className="productList__btn" onClick={() => { addProductToCart(2); }}>
                            Dodaj produkt
                        </button> : (product2Added ? <div className="productList__productAddedWrapper">
                            <img className="productList__icon" src={tickIcon} alt="ok" />
                            <h3 className="productList__productAdded">
                                Produkt został dodany
                            </h3>
                            <button className="productList__btn" onClick={() => { removeProductFromCart(2); }}>
                                Usuń produkt
                            </button>
                        </div> : "")}
                    </section>
                    <h5 className="productList__item__header">
                        Produkt 3.
                    </h5>
                    <section className="productList__item d-flex">
                        <select value={product3 + '-' + product1Price} onChange={(e) => { setProduct3(e.target.value.split('-')[0]); setProduct3Price(e.target.value.split('-')[1]); }}>
                            {!product3 ? <option>
                                Wybierz produkt
                            </option> : ""}
                            {products.map((item, index) => {
                                return <option key={index} value={item.id + '-' + item.price}>
                                    {item.name}
                                </option>
                            })}
                        </select>
                        <label className="ml-3">
                            Ilość
                            <select value={product3Amount}
                                    onChange={(e) => { setProduct3Amount(e.target.value); }}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </label>
                        <label className="d-block ml-3">
                            Rozmiar
                            <select value={product3Size}
                                    onChange={(e) => { setProduct3Size(e.target.value); }}>
                                {!product3AvailableSizes.length ? <option>
                                    Wybierz rozmiar
                                </option> : ""}
                                {product3AvailableSizes.map((item, index) => {
                                    return <option key={index} value={item}>
                                        {item}
                                    </option>
                                })}
                            </select>
                        </label>
                        {!product3Added && product3 && product3Size ? <button className="productList__btn" onClick={() => { addProductToCart(3); }}>
                            Dodaj produkt
                        </button> : (product3Added ? <div className="productList__productAddedWrapper">
                            <img className="productList__icon" src={tickIcon} alt="ok" />
                            <h3 className="productList__productAdded">
                                Produkt został dodany
                            </h3>
                            <button className="productList__btn" onClick={() => { removeProductFromCart(3); }}>
                                Usuń produkt
                            </button>
                        </div> : "")}
                    </section>
                    <h5 className="productList__item__header">
                        Produkt 4.
                    </h5>
                    <section className="productList__item d-flex">
                        <select value={product4 + '-' + product4Price} onChange={(e) => { setProduct4(e.target.value.split('-')[0]); setProduct4Price(e.target.value.split('-')[1]); }}>
                            {!product4 ? <option>
                                Wybierz produkt
                            </option> : ""}
                            {products.map((item, index) => {
                                return <option key={index} value={item.id + '-' + item.price}>
                                    {item.name}
                                </option>
                            })}
                        </select>
                        <label className="ml-3">
                            Ilość
                            <select value={product4Amount}
                                    onChange={(e) => { setProduct4Amount(e.target.value); }}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </label>
                        <label className="d-block ml-3">
                            Rozmiar
                            <select value={product4Size}
                                    onChange={(e) => { setProduct4Size(e.target.value); }}>
                                {!product4AvailableSizes.length ? <option>
                                    Wybierz rozmiar
                                </option> : ""}
                                {product4AvailableSizes.map((item, index) => {
                                    return <option key={index} value={item}>
                                        {item}
                                    </option>
                                })}
                            </select>
                        </label>
                        {!product4Added && product4 && product4Size ? <button className="productList__btn" onClick={() => { addProductToCart(4); }}>
                            Dodaj produkt
                        </button> : (product4Added ? <div className="productList__productAddedWrapper">
                            <img className="productList__icon" src={tickIcon} alt="ok" />
                            <h3 className="productList__productAdded">
                                Produkt został dodany
                            </h3>
                            <button className="productList__btn" onClick={() => { removeProductFromCart(4); }}>
                                Usuń produkt
                            </button>
                        </div> : "")}
                    </section>
                    <h5 className="productList__item__header">
                        Produkt 5.
                    </h5>
                    <section className="productList__item d-flex">
                        <select value={product5 + '-' + product5Price} onChange={(e) => { setProduct5(e.target.value.split('-')[0]); setProduct5Price(e.target.value.split('-')[1]); }}>
                            {!product5 ? <option>
                                Wybierz produkt
                            </option> : ""}
                            {products.map((item, index) => {
                                return <option key={index} value={item.id + '-' + item.price}>
                                    {item.name}
                                </option>
                            })}
                        </select>
                        <label className="ml-3">
                            Ilość
                            <select value={product5Amount}
                                    onChange={(e) => { setProduct5Amount(e.target.value); }}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </label>
                        <label className="d-block ml-3">
                            Rozmiar
                            <select value={product5Size}
                                    onChange={(e) => { setProduct5Size(e.target.value); }}>
                                {!product5AvailableSizes.length ? <option>
                                    Wybierz rozmiar
                                </option> : ""}
                                {product5AvailableSizes.map((item, index) => {
                                    return <option key={index} value={item}>
                                        {item}
                                    </option>
                                })}
                            </select>
                        </label>
                        {!product5Added && product5 && product5Size ? <button className="productList__btn" onClick={() => { addProductToCart(5); }}>
                            Dodaj produkt
                        </button> : (product5Added ? <div className="productList__productAddedWrapper">
                            <img className="productList__icon" src={tickIcon} alt="ok" />
                            <h3 className="productList__productAdded">
                                Produkt został dodany
                            </h3>
                            <button className="productList__btn" onClick={() => { removeProductFromCart(5); }}>
                                Usuń produkt
                            </button>
                        </div> : "")}
                    </section>
                </main>
            </section>
            <form className="shippingForm__form" onSubmit={formik.handleSubmit}>
                <section className="shippingForm__section">
                    <h3 className="clientForm__subheader">
                        Dane dostawy
                    </h3>
                    <span className="clientForm__row d-flex justify-content-between align-items-center">
                <label className={formik.errors.firstName && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                    <input className="clientForm__input"
                           name="firstName"
                           type="text"
                           disabled={isAuth}
                           value={formik.values.firstName}
                           onChange={formik.handleChange}
                           placeholder="Imię"
                    />
                </label>
                <label className={formik.errors.lastName && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                    <input className="clientForm__input"
                           name="lastName"
                           type="text"
                           disabled={isAuth}
                           value={formik.values.lastName}
                           onChange={formik.handleChange}
                           placeholder="Nazwisko"
                    />
                </label>
            </span>
                    <label className={formik.errors.email && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                        <input className="clientForm__input"
                               name="email"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.email}
                               onChange={formik.handleChange}
                               placeholder="Adres email"
                        />
                    </label>
                    <label className={formik.errors.phoneNumber && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                        <input className="clientForm__input"
                               name="phoneNumber"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.phoneNumber}
                               onChange={formik.handleChange}
                               placeholder="Numer telefonu"
                        />
                    </label>
                    <span className="clientForm__row d-flex justify-content-between align-items-center">
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-30 input--error" : "clientForm__label w-30"}>
                        <input className="clientForm__input"
                               name="postalCode"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.postalCode}
                               onChange={formik.handleChange}
                               placeholder="Kod pocztowy"
                        />
                    </label>
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-68 input--error" : "clientForm__label w-68"}>
                        <input className="clientForm__input"
                               name="city"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.city}
                               onChange={formik.handleChange}
                               placeholder="Miejscowość"
                        />
                    </label>
                </span>
                    <span className="clientForm__row d-flex justify-content-between align-items-center">
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-48 input--error" : "clientForm__label w-48"}>
                        <input className="clientForm__input"
                               name="street"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica"
                        />
                    </label>
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-25 input--error" : "clientForm__label w-25"}>
                        <input className="clientForm__input"
                               name="building"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.building}
                               onChange={formik.handleChange}
                               placeholder="Budynek"
                        />
                    </label>
                     <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-25 input--error" : "clientForm__label w-25"}>
                        <input className="clientForm__input"
                               name="flat"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.flat}
                               onChange={formik.handleChange}
                               placeholder="Mieszkanie"
                        />
                    </label>
                </span>


                    <label className="clientForm__label clientForm__label--textArea">
                    <textarea placeholder="Komentarz do zamówienia (opcjonalnie)"
                              name="comment"
                              value={formik.values.comment}
                              onChange={formik.handleChange}
                              className="textarea" />
                    </label>

                    <label className="label--button">
                        <button className="formBtn" onClick={(e) => { e.preventDefault(); setVat(!vat); }}>
                            <span className={vat ? "formBtn--checked" : "d-none"}></span>
                        </button>
                        Dodaj fakturę
                    </label>


                    {vat ? <section className="clientForm--vat mt-4">
                        <h3 className="clientForm__subheader">
                            Dane do faktury
                        </h3>
                        <label className="clientForm__label">
                            <input className="clientForm__input"
                                   name="companyName"
                                   type="text"
                                   value={formik.values.companyName}
                                   onChange={formik.handleChange}
                                   placeholder="Nazwa firmy"
                            />
                        </label>
                        <label className="clientForm__label">
                            <input className="clientForm__input"
                                   name="nip"
                                   type="text"
                                   value={formik.values.nip}
                                   onChange={formik.handleChange}
                                   placeholder="NIP"
                            />
                        </label>
                    </section> : ""}
                </section>

                <section className="shippingForm__section mt-5 mt-lg-0">
                    <h3 className="clientForm__subheader">
                        Dostawa i płatność
                    </h3>
                    <h4 className="clientForm__shippingHeader">
                        Wybierz sposób dostawy:
                    </h4>
                    <section className="shippingMethods">
                        {shippingMethods.map((item, index) => {
                            return <><label className="label--button mb-3">
                                <button className="formBtn" onClick={(e) => { e.preventDefault();
                                    setShippingMethod(item.id);
                                    setShippingCost(item.price);
                                    if(index === 0) {
                                        /* Paczkomaty */
                                        document.querySelector(".bigModal").style.display = "block";
                                        document.querySelector(".bigModal").style.opacity = "1";
                                        document.querySelector("#easypack-search")?.setAttribute('autocomplete', 'off');
                                        setInPostModal(true);
                                    }
                                }}>
                                    <span className={shippingMethod === item.id ? "formBtn--checked" : "d-none"}></span>
                                </button>
                                {item.name} ({item.price} PLN)
                            </label>
                                {index === 0 && shippingMethod === item.id ? <address className="inPostAddress">
                                    {inPostAddress} <br/>
                                    {inPostCode} {inPostCity}
                                </address> : ""}
                            </>
                        })}
                    </section>

                    <h4 className="clientForm__shippingHeader mt-5">
                        Wybierz sposób płatności:
                    </h4>
                    <section className="paymentMethods">
                        <label className="label--button mb-3">
                            <button className="formBtn" onClick={(e) => { e.preventDefault(); setPaymentMethod(3); }}>
                                <span className={paymentMethod === 3 ? "formBtn--checked" : "d-none"}></span>
                            </button>
                            Gotówka
                        </label>
                        <label className="label--button mb-3">
                            <button className="formBtn" onClick={(e) => { e.preventDefault(); setPaymentMethod(4); }}>
                                <span className={paymentMethod === 4 ? "formBtn--checked" : "d-none"}></span>
                            </button>
                            Przelew
                        </label>
                    </section>

                    <h3 className="clientForm__subheader mt-5 mb-4">
                        Kod rabatowy
                    </h3>
                    <label className="label--button mt-3">
                        <button className="formBtn" onClick={(e) => { e.preventDefault(); setCoupon(!coupon); }}>
                            <span className={coupon ? "formBtn--checked" : "d-none"}></span>
                        </button>
                        Mam kod rabatowy
                    </label>

                    {coupon ? <section className="clientForm--vat clientForm--coupon mt-4 d-flex justify-content-between align-items-center">
                        <label className="clientForm__label mb-0">
                            <input className="clientForm__input mb-0"
                                   name="companyName"
                                   type="text"
                                   value={couponCode}
                                   disabled={couponVerified === 1}
                                   onChange={(e) => { setCouponCode(e.target.value); }}
                                   placeholder="Tu wpisz kod rabatowy"
                            />
                        </label>
                        {couponVerified !== 1 && couponVerified !== 0 ? <button className="addToCartBtn button--login button--payment button--coupon mt-0"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    verifyCoupon();
                                                                                }}
                        >
                            Dodaj kod
                        </button> : (couponVerified === 1 ? <h4 className="couponInfo couponInfo--success">
                            <img className="tickImg d-none d-md-inline" src={tickIcon} alt="dodany" />
                            Kupon został dodany
                        </h4> : "")}

                        {couponVerified === 0 ? <h4 className="couponInfo couponInfo--error">
                            Podany kupon nie istnieje
                        </h4> : ""}
                    </section> : ""}

                    {couponVerified === 1 ? <h4 className="clientForm__shippingHeader mt-5">
                        Kod rabatowy: <b>{couponCode} ({discount})</b>
                    </h4> : ""}

                    <h4 className="clientForm__shippingHeader mt-4">
                        Łącznie do zapłaty: <b>{parseFloat(sum) + parseFloat(shippingCost) - parseFloat(discountInPLN)} PLN</b>
                    </h4>

                    <button className="addToCartBtn button--login button--payment mt-1" type="submit">
                        Dodaj zamówienie
                        <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                    </button>

                    <span className="error error--login mt-4">
                    {formik.errors.firstName && formik.submitCount ? <span className="newLine">{formik.errors.firstName}</span> : ""}
                        {formik.errors.lastName && formik.submitCount ? <span className="newLine">{formik.errors.lastName}</span> : ""}
                        {formik.errors.phoneNumber && formik.submitCount ? <span className="newLine">{formik.errors.phoneNumber}</span> : ""}
                        {formik.errors.postalCode && formik.submitCount ? <span className="newLine">{formik.errors.postalCode}</span> : ""}
                        {formik.errors.email && formik.submitCount ? <span className="newLine">{formik.errors.email}</span> : ""}
                        {formik.errors.city && formik.submitCount ? <span className="newLine">{formik.errors.city}</span> : ""}
                        {formik.errors.building && formik.submitCount ? <span className="newLine">{formik.errors.building}</span> : ""}
                        {formik.errors.street && formik.submitCount ? <span className="newLine">{formik.errors.street}</span> : ""}
                        {accountExistsError !== "" ? accountExistsError : ""}

                        {shippingMethod === -1 && formik.submitCount ? <span className="newLine">Wybierz metodę wysyłki</span> : ""}
                        {paymentMethod === -1 && formik.submitCount ? <span className="newLine">Wybierz metodę płatności</span> : "" }
                </span>
                </section>
            </form>
        </> : <section className="panelContent--addOrder--success">
            <h2 className="panelContent--addOrder__header">
                {success ? "Zamówienie zostało dodane" : "Coś poszło nie tak... Prosimy spróbować później"}
            </h2>
        </section>}
    </main>
}

export default AddOrderContent;
