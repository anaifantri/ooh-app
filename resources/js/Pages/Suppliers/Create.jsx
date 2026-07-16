import React, { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderCreate from "@/Components/HeaderCreate";
import LoadingData from "../../Components/LoadingData";

export default function Create() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [supplierCategories, setSupplierCategories] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [getErrors, setGetErrors] = useState({});
    const [error, setError] = useState(null);

    const errorRef = useRef();

    const { data, setData } = useForm({
        supplier_category_id: "",
        category_code: "",
        name: "",
        address: "",
        phone: "",
        mobile: "",
        email: "",
    });

    const handleChange = (e) => {
        if (e.target.name == "supplier_category_id") {
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
                const response = await api.get("/api/supplier-categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSupplierCategories(response.data);
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

        const dataSupplier = new FormData();
        dataSupplier.append("supplier_category_id", data.supplier_category_id);
        dataSupplier.append("category_code", data.category_code);
        dataSupplier.append("name", data.name);
        dataSupplier.append("address", data.address);
        dataSupplier.append("phone", data.phone);
        dataSupplier.append("email", data.email);
        dataSupplier.append("mobile", data.mobile);

        try {
            setProcessing(true);
            const response = await api.post(
                "/api/suppliers/create",
                dataSupplier,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            router.visit("/suppliers", {
                data: { message: "Penambahan data supplier baru berhasil..!!" },
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
                        titleCreate="Data Supplier"
                        backUrl="/suppliers"
                        getProcessing={processing}
                    />
                    <div className="flex-all-center mt-4">
                        <div>
                            <div className="flex items-center mt-2">
                                <label className="w-44">
                                    Katagori Supplier
                                </label>
                                <select
                                    className="flex rounded-md border-0 text-stone-900 shadow-inner tracking-wider outline-none bg-white px-2 h-8 w-72"
                                    name="supplier_category_id"
                                    value={data.supplier_category_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    {supplierCategories.map((category) => (
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
                            {getErrors.supplier_category_id && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.supplier_category_id}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">Nama Supplier</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Input Nama Supplier"
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
                                <label className="w-44">Alamat</label>
                                <textarea
                                    className="flex p-2 w-72"
                                    name="address"
                                    placeholder="Input alamat"
                                    rows={5}
                                    value={data.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {getErrors.address && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.address}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">No. Telepon</label>
                                <input
                                    type="number"
                                    name="phone"
                                    min={0}
                                    step={1}
                                    placeholder="Input No. Telepon"
                                    className="flex p-2 h-8 w-72 spinner-disabled"
                                    autoComplete="off"
                                    onChange={handleChange}
                                />
                            </div>
                            {getErrors.phone && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.phone}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">No. Hp.</label>
                                <input
                                    type="number"
                                    name="mobile"
                                    min={0}
                                    step={1}
                                    placeholder="Input No. Hp."
                                    className="flex p-2 h-8 w-72 spinner-disabled"
                                    autoComplete="off"
                                    onChange={handleChange}
                                />
                            </div>
                            {getErrors.mobile && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.mobile}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Input Email"
                                    autoComplete="off"
                                    onChange={handleChange}
                                />
                            </div>
                            {getErrors.email && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.email}
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
