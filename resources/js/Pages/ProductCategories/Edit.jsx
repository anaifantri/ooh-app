import React, { useState, useRef, useEffect } from "react";
import { router, usePage, useForm } from "@inertiajs/react";

import { api } from "@/apiService";

import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderEdit from "@/Components/HeaderEdit";
import LoadingData from "../../Components/LoadingData";

export default function Edit() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [getErrors, setGetErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { url } = usePage();

    const errorRef = useRef();

    const { data, setData } = useForm({
        id: "",
        code: "",
        name: "",
        description: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    useEffect(() => {
        const splitUrl = url.split("/");
        const categoryId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get(
                    "/api/product-categories/" + categoryId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    },
                );
                setData(response.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");

        try {
            setProcessing(true);
            const response = await api.post(
                `/api/product-categories/${data.id}/update`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            router.visit("/product-categories", {
                data: { message: "Berhasil mengubah data katagori produk..!!" },
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
                    <HeaderEdit
                        titleEdit="Data Katagori Produk"
                        backUrl="/product-categories"
                        getProcessing={processing}
                    />
                    <div className="flex-all-center mt-4">
                        <div>
                            <div className="flex items-center mt-4">
                                <label className="w-44">Kode</label>
                                <input
                                    type="text"
                                    name="code"
                                    className="flex p-2 h-8 w-72"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    defaultValue={data.code}
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
                            <div className="flex items-center mt-4">
                                <label className="w-44">Nama</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="flex p-2 h-8 w-72"
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
