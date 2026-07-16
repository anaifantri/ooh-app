import React, { useState, useRef, useEffect } from "react";
import { router, usePage, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderEdit from "@/Components/HeaderEdit";
import LoadingData from "../../Components/LoadingData";

export default function Edit() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [supplierCategories, setSupplierCategories] = useState(null);
    const [getErrors, setGetErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { url } = usePage();

    const errorRef = useRef();

    const { data, setData } = useForm({
        id: "",
        product_category_id: "",
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
        const splitUrl = url.split("/");
        const productId = splitUrl[splitUrl.length - 1];
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
        };
        const requestSupplier = api.get("/api/suppliers/" + productId, {
            headers,
        });
        const requestCategories = api.get("/api/supplier-categories", {
            headers,
        });

        const fetchMultipleData = async () => {
            try {
                setLoading(true);
                const [responseSupplier, responseCategories] =
                    await Promise.all([requestSupplier, requestCategories]);

                setData(responseSupplier.data);
                setSupplierCategories(responseCategories.data);
                setData(
                    "supplier_category_id",
                    responseSupplier.data.supplier_category_id,
                );
                setData(
                    "category_code",
                    responseSupplier.data.supplier_category.code,
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
        formData.append("supplier_category_id", data.supplier_category_id);
        formData.append("category_code", data.category_code);
        formData.append("code", data.code);
        formData.append("name", data.name);
        formData.append("address", data.address);
        {
            data.phone != null && formData.append("phone", data.phone);
        }
        {
            data.mobile != null && formData.append("mobile", data.mobile);
        }
        {
            data.email != null && formData.append("email", data.email);
        }
        try {
            setProcessing(true);
            const response = await api.post(
                `/api/suppliers/${data.id}/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/suppliers", {
                data: { message: "Berhasil mengubah data supplier..!!" },
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
                        titleEdit="Data Supplier"
                        backUrl="/suppliers"
                        getProcessing={processing}
                    />
                    <div className="flex-all-center gap-2 mt-4">
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
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    {supplierCategories &&
                                        supplierCategories.map((category) => (
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
                            <div className="flex items-center mt-4">
                                <label className="w-44">Nama Supplier</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Input Nama Supplier"
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
                                <label className="w-44">Alamat</label>
                                <textarea
                                    className="flex p-2 w-72"
                                    name="address"
                                    placeholder="Input Alamat"
                                    rows={5}
                                    defaultValue={data.address}
                                    onChange={handleChange}
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
                                    className="flex p-2 h-8 w-72 spinner-disabled"
                                    autoComplete="off"
                                    placeholder="Input No. Telepon"
                                    defaultValue={data.phone}
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
                                    className="flex p-2 h-8 w-72 spinner-disabled"
                                    autoComplete="off"
                                    placeholder="Input No. Hp."
                                    defaultValue={data.mobile}
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
                                    placeholder="Input Email"
                                    className="flex p-2 h-8 w-72"
                                    autoComplete="off"
                                    defaultValue={data.email}
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

Edit.layout = (page) => <DashboardLayout children={page} />;
