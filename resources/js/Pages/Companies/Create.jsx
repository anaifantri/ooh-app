import React, { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderCreate from "@/Components/HeaderCreate";
import LoadingData from "../../Components/LoadingData";
import CompanySvg from "@/Assets/Svg/CompanySvg";

export default function Create() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [processing, setProcessing] = useState(false);
    const [getErrors, setGetErrors] = useState({});
    const [error, setError] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");

    const errorRef = useRef();
    const fileInputRef = useRef(null);

    const { data, setData } = useForm({
        initial: "",
        name: "",
        address: "",
        phone: "",
        mobile: "",
        email: "",
        website: "",
        logo: "",
    });

    const handleChange = (e) => {
        if (e.target.name == "logo") {
            const file = e.target.files[0];
            if (file) {
                setData(e.target.name, file);
                const previewUrl = URL.createObjectURL(file);
                setLogoPreview(previewUrl);
            }
        } else {
            setData(e.target.name, e.target.value);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");

        const dataProduct = new FormData();
        dataProduct.append("initial", data.initial);
        dataProduct.append("name", data.name);
        dataProduct.append("address", data.address);
        dataProduct.append("email", data.email);
        dataProduct.append("phone", data.phone);
        dataProduct.append("mobile", data.mobile);
        dataProduct.append("website", data.website);

        if (data.logo) {
            dataProduct.append("logo", data.logo);
        }
        try {
            setProcessing(true);
            const response = await api.post(
                "/api/companies/create",
                dataProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/companies", {
                data: {
                    message: "Penambahan data perusahaan baru berhasil..!!",
                },
            });
        } catch (err) {
            if (!err?.response) {
                setError("No Server Response..!!");
            } else if (err.response?.status === 401) {
                setError("Unauthorized..!!");
            } else {
                setGetErrors(err.response.data.errors);
                console.log(err.response.data.errors);
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
                        titleCreate="Data Perusahaan"
                        backUrl="/companies"
                        getProcessing={processing}
                    />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="flex-all-center col-span-1">
                            <div>
                                <div className="flex-all-center">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt=""
                                            className="flex w-60 mx-2"
                                        />
                                    ) : (
                                        <Svg
                                            title="Company"
                                            c={"w-60 fill-current mx-2"}
                                        >
                                            <CompanySvg />
                                        </Svg>
                                    )}
                                </div>
                                <div className="flex-all-center">
                                    <input
                                        type="file"
                                        name="logo"
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
                                        Pilih Logo
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
                                        Initial Perusahaan
                                    </label>
                                    <input
                                        type="text"
                                        name="initial"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="3 huruf"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {getErrors.initial && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            getErrors
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.initial}
                                    </span>
                                )}
                                <div className="flex items-center mt-2">
                                    <label className="w-44">
                                        Nama Perusahaan
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Input Nama Perusahaan"
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
                                    <label className="w-44">
                                        Alamat Perusahaan
                                    </label>
                                    <textarea
                                        className="flex p-2 w-72"
                                        name="address"
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
                                <div className="flex items-center mt-2">
                                    <label className="w-44">Website</label>
                                    <input
                                        type="text"
                                        name="website"
                                        className="flex p-2 h-8 w-72"
                                        autoComplete="off"
                                        onChange={handleChange}
                                    />
                                </div>
                                {getErrors.website && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            getErrors
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.website}
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
