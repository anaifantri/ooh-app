import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderShow from "@/Components/HeaderShow";
import BtnBack from "@/Components/BtnBack";
import BtnEdit from "@/Components/BtnEdit";
import BtnDelete from "@/Components/BtnDelete";
import SuccessMessage from "@/Components/SuccessMessage";
import LoadingData from "../../Components/LoadingData";

import ProfileSvg from "@/Assets/Svg/ProfileSvg";

export default function Show() {
    const page = usePage();
    const message = page.props.message;
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUrl = window.location.href;
        const splitUrl = getUrl.split("/");
        const userId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                const response = await api.get("/api/users/" + userId, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
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

    return (
        <>
            <div>
                <HeaderShow
                    titleShow="Data User"
                    url="/users"
                    getId={user.id}
                    token={token}
                />
                <SuccessMessage message={message} duration="3000" />
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex-all-center col-span-1">
                        {user.photo ? (
                            <img
                                src={user.photo}
                                alt=""
                                className="flex rounded-full w-36 h-36 mx-2"
                            />
                        ) : (
                            <Svg title="Profile" c={"w-36 fill-current mx-2"}>
                                <ProfileSvg />
                            </Svg>
                        )}
                    </div>
                    <div className="col-span-2 texl-lg">
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Nama</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {user.name}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Username</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {user.username}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Email</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {user.email}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Nomor Hp.</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {user.phone}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Jenis Kelamin</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {user.gender == "M" ? "Laki-Laki" : "Perempuan"}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
