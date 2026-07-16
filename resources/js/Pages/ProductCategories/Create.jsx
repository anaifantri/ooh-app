import React, { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderCreate from "@/Components/HeaderCreate";

export default function Create() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [processing, setProcessing] = useState(false);
    const [getErrors, setGetErrors] = useState({});
    const [error, setError] = useState(null);

    const errorRef = useRef();

    const { data, setData } = useForm({
        code: "",
        name: "",
        description: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");

        const dataCategory = new FormData();
        dataCategory.append("code", data.code);
        dataCategory.append("name", data.name);
        dataCategory.append("description", data.description);

        try {
            setProcessing(true);
            const response = await api.post(
                "/api/product-categories/create",
                dataCategory,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/product-categories", {
                data: {
                    message: "Penambahan katagori produk baru berhasil..!!",
                },
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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <HeaderCreate
                        titleCreate="Data Katagori Produk"
                        backUrl="/product-categories"
                        getProcessing={processing}
                    />
                    <div className="flex-all-center w-full">
                        <div>
                            <div className="flex items-center mt-2">
                                <label className="w-44">Kode</label>
                                <input
                                    type="text"
                                    name="code"
                                    maxLength="3"
                                    minLength="3"
                                    className="flex p-2 h-8 w-32 uppercase"
                                    placeholder="3 huruf"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {getErrors.code && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.code}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">Nama Katagori</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="flex p-2 h-8 w-96"
                                    placeholder="Input Nama"
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
                            <div className="flex mt-2">
                                <label className="w-44">Deskripsi</label>
                                <textarea
                                    className="flex p-2 w-96"
                                    name="description"
                                    placeholder="Input Deskripsi"
                                    rows={5}
                                    cols={30}
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

Create.layout = (page) => <DashboardLayout children={page} />;
