import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderShow from "@/Components/HeaderShow";
import SuccessMessage from "@/Components/SuccessMessage";
import LoadingData from "../../Components/LoadingData";

export default function Show() {
    const page = usePage();
    const { url } = usePage();
    const message = page.props.message;
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [productCategory, setProductCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const splitUrl = url.split("/");
        const categoryId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                const response = await api.get(
                    "/api/product-categories/" + categoryId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setProductCategory(response.data);
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
                    titleShow="Data Katagori Produk"
                    url="/product-categories"
                    getId={productCategory.id}
                    token={token}
                />
                <SuccessMessage message={message} duration="3000" />
                <div className="flex-all-center mt-4">
                    <div className="texl-lg rounded-lg p-4 bg-white">
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Kode Katagori</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {productCategory.code}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Nama Katagori</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {productCategory.name}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Deskripsi</label>
                            <label>:</label>
                            <label className="flex px-2 font-semibold max-w-100">
                                {productCategory.description
                                    ? productCategory.description
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
