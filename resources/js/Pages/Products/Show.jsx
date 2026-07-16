import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderShow from "@/Components/HeaderShow";
import SuccessMessage from "@/Components/SuccessMessage";
import LoadingData from "../../Components/LoadingData";

import ProductSvg from "@/Assets/Svg/ProductSvg";

export default function Show() {
    const page = usePage();
    const message = page.props.message;
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUrl = window.location.href;
        const splitUrl = getUrl.split("/");
        const productId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                const response = await api.get("/api/products/" + productId, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProduct(response.data);
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

        fetchData();
    }, []);

    if (loading) {
        return <LoadingData />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div>
                <HeaderShow
                    titleShow="Data Produk"
                    url="/products"
                    getId={product.id}
                    token={token}
                />
                <SuccessMessage message={message} duration="3000" />
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex-all-center col-span-1">
                        {product.photo ? (
                            <img
                                src={product.photo}
                                alt=""
                                className="flex rounded-full w-60 h-60 mx-2"
                            />
                        ) : (
                            <Svg title="Product" c={"w-60 fill-current mx-2"}>
                                <ProductSvg />
                            </Svg>
                        )}
                    </div>
                    <div className="col-span-2 texl-lg rounded-lg p-4 bg-white">
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Katagori Produk</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {product.product_category.name}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Kode Produk</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {product.code}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Nama Produk</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {product.name}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Harga</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {product.price
                                    ? product.price.toLocaleString()
                                    : "-"}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Deskripsi</label>
                            <label>:</label>
                            <label className="flex px-2 font-semibold max-w-100">
                                {product.description
                                    ? product.description
                                    : "-"}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
