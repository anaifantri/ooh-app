import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderShow from "@/Components/HeaderShow";
import SuccessMessage from "@/Components/SuccessMessage";
import LoadingData from "../../Components/LoadingData";

import CompanySvg from "@/Assets/Svg/CompanySvg";

export default function Show() {
    const page = usePage();
    const { url } = usePage();
    const message = page.props.message;
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const splitUrl = url.split("/");
        const companyId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                const response = await api.get("/api/companies/" + companyId, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCompany(response.data);
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
                    titleShow="Data Perusahaan"
                    url="/companies"
                    getId={company.id}
                    token={token}
                />
                <SuccessMessage message={message} duration="3000" />
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex-all-center col-span-1">
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt=""
                                className="flex w-48 mx-2"
                            />
                        ) : (
                            <Svg title="Product" c={"w-48 fill-current mx-2"}>
                                <CompanySvg />
                            </Svg>
                        )}
                    </div>
                    <div className="col-span-2 texl-lg rounded-lg p-4 bg-white">
                        <div className="flex w-full p-1">
                            <label className="flex w-40">
                                Initial Perusahaan
                            </label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {company.initial}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-40">Nama Perusahaan</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {company.name}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-40">
                                Alamat Perusahaan
                            </label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold max-w-125">
                                {company.address}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-40">No. Telepon</label>
                            <label>:</label>
                            <label className="flex px-2 font-semibold max-w-100">
                                {company.phone}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-40">No. Hp.</label>
                            <label>:</label>
                            <label className="flex px-2 font-semibold max-w-100">
                                {company.mobile}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-40">Email</label>
                            <label>:</label>
                            <label className="flex px-2 font-semibold max-w-100">
                                {company.email}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-40">Website</label>
                            <label>:</label>
                            <label className="flex px-2 font-semibold max-w-100">
                                {company.website}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
