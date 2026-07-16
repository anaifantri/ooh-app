import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
import FormattedDateLong from "@/Utils/FormattedDateLong";
import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderShow from "@/Components/HeaderShow";
import SuccessMessage from "@/Components/SuccessMessage";
import LoadingData from "../../Components/LoadingData";

export default function Show() {
    const page = usePage();
    const message = page.props.message;
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [purchaseRequest, setPurchaseRequest] = useState(null);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUrl = window.location.href;
        const splitUrl = getUrl.split("/");
        const requestId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                const response = await api.get(
                    "/api/purchase-requests/" + requestId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setPurchaseRequest(response.data);
                setProducts(response.data.products);
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
                    titleShow="Data Permintaan Barang"
                    url="/purchase-requests"
                    getId={purchaseRequest.id}
                    token={token}
                />
                <SuccessMessage message={message} duration="3000" />

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-2 border border-stone-500 rounded-lg bg-white">
                        <div className="flex items-center mt-2">
                            <label className="w-32">Nomor</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {purchaseRequest.number}
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">Tanggal</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {FormattedDateLong(purchaseRequest.created_at)}
                            </label>
                        </div>
                        <div className="flex items-start mt-2">
                            <label className="w-32">Diminta oleh</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {purchaseRequest.request_by}
                            </label>
                        </div>
                    </div>
                    <div className="p-2 border border-stone-500 rounded-lg bg-white">
                        <div className="flex items-center mt-2">
                            <label className="w-32">Kode Gudang</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {purchaseRequest.warehouse.code}
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">Nama Gudang</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {purchaseRequest.warehouse.name}
                            </label>
                        </div>
                        <div className="flex items-start mt-2">
                            <label className="w-32">Alamat</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {purchaseRequest.warehouse.address}
                            </label>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <table className="table-auto w-full">
                            <thead>
                                <tr className="bg-slate-200 h-8">
                                    <th className="th-center w-12">No.</th>
                                    <th className="th-center w-28">
                                        Kode Barang
                                    </th>
                                    <th className="th-center">Nama Barang</th>
                                    <th className="th-center w-20">Satuan</th>
                                    <th className="th-center w-20">Jumlah</th>
                                    <th className="th-center w-24">
                                        Jumlah PO
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr className="bg-white" key={index}>
                                        <td className="td-center">
                                            {index + 1}
                                        </td>
                                        <td className="td-center">
                                            {product.code}
                                        </td>
                                        <td className="td-left">
                                            {product.name}
                                        </td>
                                        <td className="td-center">
                                            {product.unit}
                                        </td>
                                        <td className="td-center">
                                            {
                                                purchaseRequest
                                                    .request_products[index]
                                                    .request_qty
                                            }
                                        </td>
                                        <td className="td-center">
                                            {
                                                purchaseRequest
                                                    .request_products[index]
                                                    .po_qty
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-6">
                            <label className="flex w-32">Catatan :</label>
                            <label className="flex w-240 mt-2 font-semibold border rounded-xl bg-white p-2">
                                {purchaseRequest.note
                                    ? purchaseRequest.note
                                    : "-"}
                            </label>
                        </div>
                        <div className="mt-6">
                            <label className="flex w-32">Progress</label>
                            <div className="flex ml-3">
                                <div className="flex-all-center border rounded-full w-6 h-6 bg-teal-700 border-white text-white">
                                    1
                                </div>
                                <div className="border-b-2 border-stone-900 w-30 h-3"></div>
                                <div className="flex-all-center border rounded-full w-6 h-6 bg-slate-700 border-white text-white">
                                    2
                                </div>
                                <div className="border-b-2 border-stone-900 w-30 h-3"></div>
                                <div className="flex-all-center border rounded-full w-6 h-6 bg-slate-700 border-white text-white">
                                    3
                                </div>
                                <div className="border-b-2 border-stone-900 w-30 h-3"></div>
                                <div className="flex-all-center border rounded-full w-6 h-6 bg-slate-700 border-white text-white">
                                    4
                                </div>
                                <div className="border-b-2 border-stone-900 w-30 h-3"></div>
                                <div className="flex-all-center border rounded-full w-6 h-6 bg-slate-700 border-white text-white">
                                    5
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex-all-center text-teal-700">
                                    Dibuat
                                </div>
                                <div className="w-28"></div>
                                <div className="flex-all-center text-slate-700">
                                    PO
                                </div>
                                <div className="w-24"></div>
                                <div className="flex-all-center text-slate-700">
                                    Penerimaan
                                </div>
                                <div className="w-19"></div>
                                <div className="flex-all-center text-slate-700">
                                    Faktur
                                </div>
                                <div className="w-24"></div>
                                <div className="flex-all-center text-slate-700">
                                    Selesai
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
