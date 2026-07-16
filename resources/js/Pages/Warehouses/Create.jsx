import React, { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderCreate from "@/Components/HeaderCreate";
import WarehouseSvg from "@/Assets/Svg/WarehouseSvg";

export default function Create() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [processing, setProcessing] = useState(false);
    const [getErrors, setGetErrors] = useState({});
    const [error, setError] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");

    const errorRef = useRef();
    const fileInputRef = useRef(null);

    const { data, setData } = useForm({
        code: "",
        name: "",
        address: "",
        phone: "",
        mobile: "",
        email: "",
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

        const formData = new FormData();
        formData.append("code", data.code);
        formData.append("name", data.name);
        formData.append("address", data.address);
        formData.append("phone", data.phone);
        formData.append("mobile", data.mobile);
        formData.append("email", data.email);

        if (data.photo) {
            formData.append("photo", data.photo);
        }
        try {
            setProcessing(true);
            const response = await api.post(
                "/api/warehouses/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/warehouses", {
                data: { message: "Penambahan data gudang baru berhasil..!!" },
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
                        titleCreate="Data Gudang"
                        backUrl="/warehouses"
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
                                            <WarehouseSvg />
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
                                    <label className="w-44">Kode Gudang</label>
                                    <input
                                        type="text"
                                        name="code"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Input Kode"
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
                                    <label className="w-44">Nama Gudang</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Input Nama Gudang"
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
                                        Alamat Gudang
                                    </label>
                                    <textarea
                                        className="flex p-2 w-72"
                                        name="address"
                                        rows={5}
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
                                        placeholder="Input No. Telepon"
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
                                    <label className="w-44">No. Hp</label>
                                    <input
                                        type="number"
                                        name="mobile"
                                        min={0}
                                        step={1}
                                        className="flex p-2 h-8 w-72 spinner-disabled"
                                        placeholder="Input No. Hp"
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
                                        min={0}
                                        step={1}
                                        className="flex p-2 h-8 w-72 spinner-disabled"
                                        placeholder="Input email"
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
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
