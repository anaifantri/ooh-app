import { api } from "@/apiService";

import { router } from "@inertiajs/react";
import { useState } from "react";

import Svg from "@/Components/Svg";

import LogoutSvg from "@/Assets/Svg/LogoutSvg";
import ProfileSvg from "@/Assets/Svg/ProfileSvg";

export default function RightNav() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const dataUser = JSON.parse(localStorage.getItem("dataUser"));
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setProcessing(true);
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
        } catch (err) {
            setProcessing(false);
            console.error("Logout gagal:", err.response);
            // Tetap hapus token lokal jika terjadi error unauthenticated (401)
            localStorage.removeItem("token");
            router.visit("/");
        }
    };

    return (
        <div className="flex justify-end items-center mx-2 sm:col-span-2 w-full">
            <div>
                <div className="flex-all-center text-teal-500 hover:text-teal-300 cursor-pointer">
                    {dataUser.photo ? (
                        <img
                            src={dataUser.photo}
                            alt=""
                            className="flex rounded-full w-6 h-6 mx-2"
                        />
                    ) : (
                        <Svg title="Profile" c={"w-5 fill-current mx-2"}>
                            <ProfileSvg />
                        </Svg>
                    )}
                    <span className="hidden sm:flex justify-center items-center text-xs">
                        {dataUser.name}
                    </span>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <button
                    type="submit"
                    disabled={processing}
                    className={
                        processing
                            ? "flex-all-center text-slate-500 cursor-pointer mx-2"
                            : "flex-all-center text-teal-500 hover:text-teal-300 cursor-pointer mx-2"
                    }
                >
                    <Svg title="Logout" c={"w-5 fill-current mx-1"}>
                        <LogoutSvg />
                    </Svg>
                </button>
            </form>
        </div>
    );
}
