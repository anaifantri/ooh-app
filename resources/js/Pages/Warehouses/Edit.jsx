import React, { useState, useRef, useEffect } from "react";
import { router, usePage, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderEdit from "@/Components/HeaderEdit";
import ProfileSvg from "@/Assets/Svg/ProfileSvg";
import LoadingData from "../../Components/LoadingData";

export default function Edit() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [photoPreview, setPhotoPreview] = useState("");
    const [getErrors, setGetErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { url } = usePage();

    const fileInputRef = useRef(null);
    const errorRef = useRef();

    const { data, setData } = useForm({
        id: "",
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

    useEffect(() => {
        const splitUrl = url.split("/");
        const warehouseId = splitUrl[splitUrl.length - 1];
        console.log(warehouseId);

        const fetchMultipleData = async () => {
            try {
                setLoading(true);
                const response = await api.get(
                    "/api/warehouses/" + warehouseId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setData(response.data);
                setPhotoPreview(response.data.photo);
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
        formData.append("code", data.code);
        formData.append("name", data.name);
        formData.append("address", data.address);
        {
            data.photo != null && formData.append("photo", data.photo);
        }
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
                `/api/warehouses/${data.id}/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/warehouses", {
                data: { message: "Berhasil mengubah data gudang..!!" },
            });
        } catch (err) {
            if (!err?.response) {
                setErrorMessage("No Server Response..!!");
            } else if (err.response?.status === 401) {
                setErrorMessage("Unauthorized..!!");
            } else {
                setGetErrors(err.response.data.errors);
                console.log(err.response.data.errors);
                setErrorMessage("Update gagal..!!");
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
                        titleEdit="Data Gudang"
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
                                            className="flex rounded-full w-60 h-60 mx-2"
                                        />
                                    ) : (
                                        <Svg
                                            title="Profile"
                                            c={"w-60 fill-current mx-2"}
                                        >
                                            <ProfileSvg />
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
                            <div className="flex items-center mt-4">
                                <label className="w-44">Kode Gudang</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Input Kode"
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
                                <label className="w-44">Nama Gudang</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Input Nama Gudang"
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
                                <label className="w-44">Alamat Gudang</label>
                                <textarea
                                    className="flex p-2 w-72"
                                    name="address"
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
                                    min={0}
                                    step={1}
                                    className="flex p-2 h-8 w-72 spinner-disabled"
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
