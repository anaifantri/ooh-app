import React, { useState, useRef, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderEdit from "@/Components/HeaderEdit";
import ProfileSvg from "@/Assets/Svg/ProfileSvg";
import LoadingData from "../../Components/LoadingData";

export default function Edit() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [auth, setAuth] = useState(
        JSON.parse(localStorage.getItem("dataUser")),
    );
    const [photoPreview, setPhotoPreview] = useState("");
    const fileInputRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [changePassword, setChangePassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const confirmPasswordRef = useRef();
    const nameRef = useRef();
    const errorRef = useRef();
    const [getErrors, setGetErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [errorPassword, setErrorPassword] = useState(null);

    const [user, setUser] = useState({
        id: "",
        name: "",
        username: "",
        email: "",
        phone: "",
        gender: "",
        photo: null,
        oldPassword: null,
        password: null,
    });

    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        if (e.target.name == "photo") {
            const file = e.target.files[0];
            if (file) {
                setPhoto(file);
                const previewUrl = URL.createObjectURL(file);
                setPhotoPreview(previewUrl);
            }
        } else if (
            e.target.name == "oldPassword" ||
            e.target.name == "password"
        ) {
            setUser({ ...user, [e.target.name]: e.target.value });
            if (errorPassword) setErrorPassword("");
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const handleCbChange = (event) => {
        setChangePassword(event.target.checked);
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click(); // Trigger the hidden file input click
    };

    const { url } = usePage();

    useEffect(() => {
        const splitUrl = url.split("/");
        const userId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get("/api/users/" + userId, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
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

        fetchData();
    }, []);

    if (loading) {
        return <LoadingData />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        // Optional: Validate on change to provide instant feedback
        if (user.password !== e.target.value) {
            setErrorPassword("Passwords do not match");
        } else {
            setErrorPassword("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");

        if (changePassword == true && user.password !== confirmPassword) {
            setErrorPassword("Passwords do not match");
            alert("Konfirmasi password tidak cocok..!!");
            confirmPasswordRef.current.focus();
        } else {
            const formData = new FormData();
            formData.append("id", user.id);
            formData.append("name", user.name);
            formData.append("username", user.username);
            formData.append("email", user.email);
            formData.append("phone", user.phone);
            formData.append("gender", user.gender);
            if (user.password != null && user.password != "") {
                formData.append("oldPassword", user.oldPassword);
                formData.append("password", user.password);
            }
            if (photo) {
                formData.append("photo", photo);
            }
            try {
                setProcessing(true);
                const response = await api.post(
                    `/api/users/${user.id}/update`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "mulipart/form-data",
                        },
                    },
                );
                if (auth.id === user.id) {
                    if (user.password != null && user.password != "") {
                        await api.post(
                            "/api/logout",
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "X-Requested-with": "XMLHttpRequest",
                                },
                            },
                        );
                        localStorage.removeItem("token");
                        localStorage.removeItem("dataUser");
                        router.visit("/");
                    } else {
                        router.visit(`/users/show/${auth.id}`, {
                            data: {
                                message: "Berhasil mengubah data profile..!!",
                            },
                        });
                    }
                } else {
                    router.visit("/users", {
                        data: { message: "Berhasil mengubah data user..!!" },
                    });
                }
            } catch (err) {
                if (!err?.response) {
                    setErrorMessage("No Server Response..!!");
                } else if (err.response?.status === 401) {
                    setErrorMessage("Unauthorized..!!");
                } else {
                    setGetErrors(err.response.data.errors);
                    console.log(err.response.data.errors);
                    nameRef.current.focus();
                    setErrorMessage("Update gagal..!!");
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
                    <HeaderEdit
                        titleEdit="Data Pengguna"
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
                                        Ganti Foto
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
                        <div className="col-span-2">
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
                                    defaultValue={user.name}
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
                                    placeholder="Username"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    defaultValue={user.username}
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
                                <label className="w-44">Nomor Hp.</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Nomor Handphone"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    defaultValue={user.phone}
                                    required
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
                                    type="text"
                                    name="email"
                                    className="flex p-2 h-8 w-72"
                                    placeholder="Email"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    defaultValue={user.email}
                                    required
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
                                <label className="w-44">Jenis Kelamin</label>

                                {user.gender == "M" ? (
                                    <>
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="outline-none"
                                            onChange={handleChange}
                                            value="M"
                                            defaultChecked
                                        />
                                        <label className="ml-2">
                                            Laki-Laki
                                        </label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="outline-none ml-2"
                                            onChange={handleChange}
                                            value="F"
                                        />
                                        <label className="ml-2">
                                            Perempuan
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="outline-none"
                                            onChange={handleChange}
                                            value="M"
                                        />
                                        <label className="ml-2">
                                            Laki-Laki
                                        </label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="outline-none ml-2"
                                            onChange={handleChange}
                                            value="F"
                                            defaultChecked
                                        />
                                        <label className="ml-2">
                                            Perempuan
                                        </label>
                                    </>
                                )}
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

                            <div className="flex items-center mt-2">
                                <label className="w-44">Ganti Password</label>
                                <input
                                    className="outline-none"
                                    type="checkbox"
                                    checked={changePassword}
                                    onChange={handleCbChange}
                                />
                                <label className="ml-2 italic">yes</label>
                            </div>
                            <div
                                className={
                                    changePassword == true
                                        ? "flex items-center mt-2"
                                        : "hidden items-center mt-2"
                                }
                            >
                                {changePassword == true &&
                                    auth.id == user.id && (
                                        <>
                                            <label className="w-44">
                                                Old Password
                                            </label>
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                className="flex p-2 h-8 w-72"
                                                placeholder="Old Password"
                                                onChange={handleChange}
                                                required
                                            />
                                        </>
                                    )}
                            </div>
                            {getErrors.oldPassword && (
                                <span
                                    ref={errorRef}
                                    className={
                                        errorMessage
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.oldPassword}
                                </span>
                            )}
                            <div
                                className={
                                    changePassword == true
                                        ? "flex items-center mt-2"
                                        : "hidden items-center mt-2"
                                }
                            >
                                <label className="w-44">New Password</label>

                                {changePassword == true && (
                                    <input
                                        type="password"
                                        name="password"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="New Password"
                                        onChange={handleChange}
                                        required
                                    />
                                )}
                            </div>
                            <div
                                className={
                                    changePassword == true
                                        ? "flex items-center mt-2"
                                        : "hidden items-center mt-2"
                                }
                            >
                                <label className="w-44">
                                    Konfirmasi Password
                                </label>
                                {changePassword == true && (
                                    <input
                                        type="password"
                                        className="flex p-2 h-8 w-72"
                                        placeholder="Konfirmasi Password"
                                        onChange={handleConfirmPasswordChange}
                                        ref={confirmPasswordRef}
                                        required
                                    />
                                )}
                            </div>
                            {errorPassword && (
                                <p style={{ color: "red" }}>{errorPassword}</p>
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
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
