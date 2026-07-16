import React, { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import Units from "@/Utils/Units";
import HeaderCreate from "@/Components/HeaderCreate";
import LoadingData from "../../Components/LoadingData";
import ProductSvg from "@/Assets/Svg/ProductSvg";

export default function Create() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [productCategories, setProductCategories] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [getErrors, setGetErrors] = useState({});
    const [error, setError] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");

    const errorRef = useRef();
    const fileInputRef = useRef(null);

    const { data, setData } = useForm({
        product_category_id: "",
        category_code: "",
        name: "",
        price: "",
        unit: "",
        description: "",
        photo: "",
    });

    const handleChange = (e) => {
        if (e.target.name == "photo") {
            const file = e.target.files[0];
            if (file) {
                setData(e.target.name, file);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/product-categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProductCategories(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");

        const dataProduct = new FormData();
        dataProduct.append("product_category_id", data.product_category_id);
        dataProduct.append("category_code", data.category_code);
        dataProduct.append("name", data.name);
        dataProduct.append("price", data.price);
        dataProduct.append("unit", data.unit);
        dataProduct.append("description", data.description);

        if (data.photo) {
            dataProduct.append("photo", data.photo);
        }
        try {
            setProcessing(true);
            const response = await api.post(
                "/api/products/create",
                dataProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/products", {
                data: { message: "Penambahan produk baru berhasil..!!" },
            });
        } catch (err) {
            if (!err?.response) {
                setError("No Server Response..!!");
            } else if (err.response?.status === 401) {
                setError("Unauthorized..!!");
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
                    <HeaderCreate
                        titleCreate="Data Produk"
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
                                            className="flex rounded-full w-36 h-36 mx-2"
                                        />
                                    ) : (
                                        <Svg
                                            title="Product"
                                            c={"w-36 fill-current mx-2"}
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
                                        Pilih Foto
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
                        <div className="flex-all-center col-span-2">
                            <div>
                                <div className="flex items-center mt-2">
                                    <label className="w-44">
                                        Katagori Produk
                                    </label>
                                    <select
                                        className="flex rounded-md border-0 text-stone-900 shadow-inner tracking-wider outline-none bg-white px-2 h-8 w-72"
                                        name="product_category_id"
                                        value={data.product_category_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        {productCategories.map(
                                            (category, index) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                    data-code={category.code}
                                                >
                                                    {category.name}
                                                </option>
                                            ),
                                        )}
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
                                <div className="flex items-center mt-2">
                                    <label className="w-44">Nama Produk</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Nama Barang"
                                        onChange={handleChange}
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
                                    <label className="w-44">Satuan</label>
                                    <select
                                        className="flex rounded-md border-0 text-stone-900 shadow-inner tracking-wider outline-none bg-white px-2 h-8 w-72"
                                        name="unit"
                                        value={data.unit}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        {Units.map((unit, index) => (
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
                                        placeholder="Harga"
                                        autoComplete="off"
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
                                        value={data.description}
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
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
