import React, { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderCreate from "@/Components/HeaderCreate";
import ProfileSvg from "@/Assets/Svg/ProfileSvg";

export default function Create() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [processing, setProcessing] = useState(false);

    const errorRef = useRef();
    const nameRef = useRef();
    const fileInputRef = useRef(null);
    const confirmPasswordRef = useRef();

    const [errorPassword, setErrorPassword] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [getErrors, setGetErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState("");
    const { data, setData } = useForm({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        photo: null,
        gender: "M",
    });

    const handleChange = (e) => {
        if (e.target.name == "photo") {
            const file = e.target.files[0];
            if (file) {
                setData(e.target.name, file);
                const previewUrl = URL.createObjectURL(file);
                setPhotoPreview(previewUrl);
            }
        } else if (e.target.name == "password") {
            setData(e.target.name, e.target.value);
            if (errorPassword) setErrorPassword("");
        } else if (e.target.name == "confirm_password") {
            setData(e.target.name, e.target.value);
            if (data.password !== e.target.value) {
                setErrorPassword("Passwords do not match");
            } else {
                setErrorPassword("");
            }
        } else {
            setData(e.target.name, e.target.value);
        }
    };

    useEffect(() => {
        nameRef.current.focus();
    }, []);

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");

        if (data.password !== data.confirm_password) {
            setErrorPassword("Passwords do not match");
            alert("Konfirmasi password tidak cocok..!!");
            confirmPasswordRef.current.focus();
        } else {
            setErrorPassword("");
            const dataUser = new FormData();
            dataUser.append("name", data.name);
            dataUser.append("username", data.username);
            dataUser.append("email", data.email);
            dataUser.append("phone", data.phone);
            dataUser.append("gender", data.gender);
            dataUser.append("password", data.password);

            if (data.photo) {
                dataUser.append("photo", data.photo);
            }
            try {
                setProcessing(true);
                const response = await api.post(
                    "/api/users/register",
                    dataUser,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "mulipart/form-data",
                        },
                    },
                );
                const registerToken = response?.data?.token;
                const registerUser = response?.data?.user;
                router.visit("/users", {
                    data: { message: "Penambahan user baru berhasil..!!" },
                });
            } catch (err) {
                if (!err?.response) {
                    setErrorMessage("No Server Response..!!");
                } else if (err.response?.status === 401) {
                    setErrorMessage("Unauthorized..!!");
                } else {
                    setGetErrors(err.response.data.errors);
                    nameRef.current.focus();
                }
            } finally {
                setProcessing(false);
            }
        }
    };

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <HeaderCreate
                        titleCreate="Data Pengguna"
                        backUrl="/users"
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
                                            title="Profile"
                                            c={"w-36 fill-current mx-2"}
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
                                        Pilih Foto
                                    </button>
                                </div>
                                {getErrors.photo && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            errorMessage
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
                                <div className="flex items-center mt-4">
                                    <label className="w-44">Nama</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Nama Lengkap"
                                        autoComplete="off"
                                        ref={nameRef}
                                        onChange={handleChange}
                                        // value={formData.name}
                                        required
                                    />
                                </div>
                                {getErrors.name && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            errorMessage
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.name}
                                    </span>
                                )}
                                <div className="flex items-center mt-2">
                                    <label className="w-44">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="username"
                                        autoComplete="off"
                                        onChange={handleChange}
                                        // value={formData.username}
                                        required
                                    />
                                </div>
                                {getErrors.username && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            errorMessage
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.username}
                                    </span>
                                )}

                                <div className="flex items-center mt-2">
                                    <label className="w-44">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Password"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex items-center mt-2">
                                    <label className="w-44">
                                        Konfirmasi Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Konfirmasi Password"
                                        onChange={handleChange}
                                        ref={confirmPasswordRef}
                                        required
                                    />
                                </div>
                                {errorPassword && (
                                    <p style={{ color: "red" }}>
                                        {errorPassword}
                                    </p>
                                )}
                                {getErrors.password && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            errorMessage
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.password}
                                    </span>
                                )}
                                <div className="flex items-center mt-2">
                                    <label className="w-44">Nomor Hp.</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Nomor Handphone"
                                        autoComplete="off"
                                        onChange={handleChange}
                                        // value={formData.phone}
                                    />
                                </div>
                                {getErrors.phone && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            errorMessage
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.phone}
                                    </span>
                                )}
                                <div className="flex items-center mt-2">
                                    <label className="w-44">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Email"
                                        autoComplete="off"
                                        onChange={handleChange}
                                        // value={formData.email}
                                    />
                                </div>
                                {getErrors.email && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            errorMessage
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.email}
                                    </span>
                                )}
                                <div className="flex items-center mt-2">
                                    <label className="w-44">
                                        Jenis Kelamin
                                    </label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="outline-none"
                                        onChange={handleChange}
                                        value="M"
                                        defaultChecked
                                    />
                                    <label className="ml-2">Laki-Laki</label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="outline-none ml-2"
                                        onChange={handleChange}
                                        value="F"
                                    />
                                    <label className="ml-2">Perempuan</label>
                                </div>
                                {getErrors.gender && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            errorMessage
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.gender}
                                    </span>
                                )}
                                {/* <div className="flex-all-center mt-4 p-2 border-b border-t w-full">
                                <BtnSave p={loading} />
                                <BtnCancel backUrl="/users" />
                            </div> */}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
