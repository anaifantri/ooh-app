import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";
import HeaderShow from "@/Components/HeaderShow";
import SuccessMessage from "@/Components/SuccessMessage";
import LoadingData from "../../Components/LoadingData";

import WarehouseSvg from "@/Assets/Svg/WarehouseSvg";

export default function Show() {
    const page = usePage();
    const { url } = usePage();
    const message = page.props.message;
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [warehouse, setWarehouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const splitUrl = url.split("/");
        const warehouseId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                const response = await api.get(
                    "/api/warehouses/" + warehouseId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setWarehouse(response.data);
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
                    titleShow="Data Gudang"
                    url="/warehouses"
                    getId={warehouse.id}
                    token={token}
                />
                <SuccessMessage message={message} duration="3000" />
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex-all-center col-span-1">
                        {warehouse.photo ? (
                            <img
                                src={warehouse.photo}
                                alt=""
                                className="flex rounded-full w-60 h-60 mx-2"
                            />
                        ) : (
                            <Svg title="Product" c={"w-60 fill-current mx-2"}>
                                <WarehouseSvg />
                            </Svg>
                        )}
                    </div>
                    <div className="col-span-2 texl-lg rounded-lg p-4 bg-white">
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Kode Gudang</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {warehouse.code}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Nama Gudang</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {warehouse.name}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Alamat Gudang</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {warehouse.address}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">No. Telepon</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {warehouse.phone}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">No. Hp.</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {warehouse.mobile}
                            </label>
                        </div>
                        <div className="flex w-full p-1">
                            <label className="flex w-32">Email</label>
                            <label>:</label>
                            <label className="flex ml-2 font-semibold">
                                {warehouse.email}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
