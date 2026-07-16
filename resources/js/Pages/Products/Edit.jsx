import React, { useState, useRef, useEffect } from "react";
import { router, usePage, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import Units from "@/Utils/Units";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderEdit from "@/Components/HeaderEdit";
import ProductSvg from "@/Assets/Svg/ProductSvg";
import LoadingData from "../../Components/LoadingData";

export default function Edit() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [productCategories, setProductCategories] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [photo, setPhoto] = useState("");
    const [getErrors, setGetErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { url } = usePage();

    const fileInputRef = useRef(null);
    const errorRef = useRef();

    const { data, setData } = useForm({
        id: "",
        product_category_id: "",
        category_code: "",
        name: "",
        unit: "",
        price: "",
        description: "",
    });

    const handleChange = (e) => {
        if (e.target.name == "photo") {
            const file = e.target.files[0];
            if (file) {
                setPhoto(file);
                const previewUrl = URL.createObjectURL(file);
                setPhotoPreview(previewUrl);
            }
        } else if (e.target.name == "product_category_id") {
            const selectedIndex = e.target.selectedIndex;
            const code = e.target.options[selectedIndex].dataset.code;
            setData("category_code", code);
            setData(e.target.name, e.target.value);
        } else {
            setData(e.target.name, e.target.value);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        const splitUrl = url.split("/");
        const productId = splitUrl[splitUrl.length - 1];
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
        };
        const requestProduct = api.get("/api/products/" + productId, {
            headers,
        });
        const requestCategories = api.get("/api/product-categories", {
            headers,
        });

        const fetchMultipleData = async () => {
            try {
                setLoading(true);
                const [responseProduct, responseCategories] = await Promise.all(
                    [requestProduct, requestCategories],
                );

                setData(responseProduct.data);
                setProductCategories(responseCategories.data);
                setPhotoPreview(responseProduct.data.photo);
                setData(
                    "product_category_id",
                    responseProduct.data.product_category_id,
                );
                setData(
                    "category_code",
                    responseProduct.data.product_category.code,
                );
            } catch (err) {
                if (!err?.response) {
                    setError("No Server Response..!!");
                } else if (err.response?.status === 401) {
                    setError("Unauthorized..!!");
                } else {
                    setError(err.response.data.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMultipleData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");

        const formData = new FormData();
        formData.append("product_category_id", data.product_category_id);
        formData.append("category_code", data.category_code);
        formData.append("code", data.code);
        formData.append("unit", data.unit);
        formData.append("name", data.name);
        {
            data.price != null && formData.append("price", data.price);
        }
        {
            photo != null || (photo != "" && formData.append("photo", photo));
        }
        {
            data.description != null &&
                formData.append("description", data.description);
        }
        try {
            setProcessing(true);
            const response = await api.post(
                `/api/products/${data.id}/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/products", {
                data: { message: "Berhasil mengubah data produk..!!" },
            });
        } catch (err) {
            if (!err?.response) {
                setErrorMessage("No Server Response..!!");
            } else if (err.response?.status === 401) {
                setErrorMessage("Unauthorized..!!");
            } else {
                setGetErrors(err.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <LoadingData />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <HeaderEdit
                        titleEdit="Data Produk"
                        backUrl="/products"
                        getProcessing={processing}
                    />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="flex-all-center col-span-1">
                            <div>
                                <div className="flex-all-center">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt=""
                                            className="flex rounded-full w-60 h-60 mx-2"
                                        />
                                    ) : (
                                        <Svg
                                            title="Profile"
                                            c={"w-60 fill-current mx-2"}
                                        >
                                            <ProductSvg />
                                        </Svg>
                                    )}
                                </div>
                                <div className="flex-all-center">
                                    <input
                                        type="file"
                                        name="photo"
                                        ref={fileInputRef}
                                        onChange={handleChange}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        className="flex-all-center bg-amber-500 text-white rounded-lg px-4 py-1 hover:bg-amber-700 mt-2 cursor-pointer"
                                        onClick={handlePhotoClick}
                                    >
                                        Ganti Foto
                                    </button>
                                </div>
                                {getErrors.photo && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            getErrors
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.photo}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex items-center mt-2">
                                <label className="w-44">Katagori Produk</label>
                                <select
                                    className="flex rounded-md border-0 text-stone-900 shadow-inner tracking-wider outline-none bg-white px-2 h-8 w-72"
                                    name="product_category_id"
                                    value={data.product_category_id}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    {productCategories &&
                                        productCategories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                                data-code={category.code}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            {getErrors.product_category_id && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.product_category_id}
                                </span>
                            )}
                            <div className="flex items-center mt-4">
                                <label className="w-44">Nama</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Nama Produk"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    defaultValue={data.name}
                                    required
                                />
                            </div>
                            {getErrors.name && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.name}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">Katagori Produk</label>
                                <select
                                    className="flex rounded-md border-0 text-stone-900 shadow-inner tracking-wider outline-none bg-white px-2 h-8 w-72"
                                    name="unit"
                                    value={data.unit}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    {Units &&
                                        Units.map((unit, index) => (
                                            <option key={index} value={unit}>
                                                {unit}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            {getErrors.unit && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.unit}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">Harga</label>
                                <input
                                    type="number"
                                    name="price"
                                    min={0}
                                    step={1}
                                    className="flex p-2 h-8 w-72 spinner-disabled"
                                    autoComplete="off"
                                    defaultValue={data.price}
                                    onChange={handleChange}
                                />
                            </div>
                            {getErrors.price && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.price}
                                </span>
                            )}
                            <div className="flex mt-2">
                                <label className="w-44">Deskripsi</label>
                                <textarea
                                    className="flex p-2 w-72"
                                    name="description"
                                    rows={5}
                                    cols={30}
                                    defaultValue={data.description}
                                    onChange={handleChange}
                                />
                            </div>
                            {getErrors.description && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.description}
                                </span>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
