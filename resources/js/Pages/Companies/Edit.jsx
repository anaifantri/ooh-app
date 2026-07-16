import React, { useState, useRef, useEffect } from "react";
import { router, usePage, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderEdit from "@/Components/HeaderEdit";
import CompanySvg from "@/Assets/Svg/CompanySvg";
import LoadingData from "../../Components/LoadingData";

export default function Edit() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [logoPreview, setLogoPreview] = useState("");
    const [logo, setLogo] = useState("");
    const [getErrors, setGetErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { url } = usePage();

    const fileInputRef = useRef(null);
    const errorRef = useRef();

    const { data, setData } = useForm({
        id: "",
        initial: "",
        name: "",
        address: "",
        phone: "",
        mobile: "",
        email: "",
        website: "",
    });

    const handleChange = (e) => {
        if (e.target.name == "logo") {
            const file = e.target.files[0];
            if (file) {
                setLogo(file);
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

    useEffect(() => {
        const splitUrl = url.split("/");
        const companyId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get("/api/companies/" + companyId, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setData(response.data);
                setLogoPreview(response.data.logo);
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

        const formData = new FormData();
        formData.append("initial", data.initial);
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
        {
            data.website != null && formData.append("website", data.website);
        }
        {
            logo != null || (logo != "" && formData.append("logo", logo));
        }
        try {
            setProcessing(true);
            const response = await api.post(
                `/api/companies/${data.id}/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/companies", {
                data: { message: "Berhasil mengubah data perusahaan..!!" },
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
                        titleEdit="Data Perusahaan"
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
                                            className="flex w-48 mx-2"
                                        />
                                    ) : (
                                        <Svg
                                            title="Company"
                                            c={"w-48 fill-current mx-2"}
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
                                        Ganti Logo
                                    </button>
                                </div>
                                {getErrors.logo && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            getErrors
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.logo}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex items-center mt-4">
                                <label className="w-44">Initial</label>
                                <input
                                    type="text"
                                    name="initial"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Initial"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    defaultValue={data.initial}
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
                                <label className="w-44">Nama Perusahaan</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Input nama perusahaan"
                                    autoComplete="off"
                                    defaultValue={data.name}
                                    onChange={handleChange}
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
                                    rows={5}
                                    cols={30}
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
                                <label className="w-44">No. Telepon</label>
                                <input
                                    type="number"
                                    name="mobile"
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
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Input email"
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
                            <div className="flex items-center mt-2">
                                <label className="w-44">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Input website"
                                    autoComplete="off"
                                    defaultValue={data.website}
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
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
