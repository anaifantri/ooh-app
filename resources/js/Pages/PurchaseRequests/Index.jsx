import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
import FormattedDateLong from "@/Utils/FormattedDateLong";
import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderIndex from "@/Components/HeaderIndex";
import TdAction from "@/Components/TdAction";
import SuccessMessage from "@/Components/SuccessMessage";
import FailedMessage from "@/Components/FailedMessage";
import LoadingData from "@/Components/LoadingData";

export default function Index() {
    const page = usePage();
    const message = page.props.message;
    const failed = page.props.failed;
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchaseRequests, setPurchaseRequest] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/purchase-requests", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPurchaseRequest(response.data);
            } catch (error) {
                setError(error);
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
            <div className="w-360">
                <HeaderIndex
                    title="Daftar Permintaan Barang"
                    addTitle="Tambah Permintaan Barang"
                    addUrl="/purchase-requests/create"
                />
                {message && (
                    <SuccessMessage message={message} duration="3000" />
                )}
                {failed && <FailedMessage message={failed} duration="3000" />}
                <table className="table-auto mt-2 w-full">
                    <thead>
                        <tr className="h-10 bg-stone-300">
                            <th className="th-center w-10">No.</th>
                            <th className="th-center w-28">Tanggal</th>
                            <th className="th-center w-40">No. Permintaan</th>
                            <th className="th-center w-48">Gudang</th>
                            <th className="th-center w-48">Diminta Oleh</th>
                            <th className="th-center">Catatan</th>
                            <th className="th-center w-32">Progress</th>
                            <th className="th-center w-32">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseRequests.map((request, index) => (
                            <tr className="bg-white" key={index}>
                                <td className="td-center">{index + 1}</td>
                                <td className="td-center">
                                    {FormattedDateLong(request.created_at)}
                                </td>
                                <td className="td-center">{request.number}</td>
                                <td className="td-center">
                                    {request.warehouse.name}
                                </td>
                                <td className="td-center">
                                    {request.request_by}
                                </td>
                                <td className="td-left">
                                    {request.note ? request.note : "-"}
                                </td>
                                <td className="td-center">Dibuat</td>
                                <td className="td-center">
                                    <TdAction
                                        showUrl={`/purchase-requests/show/${request.id}`}
                                        editUrl={`/purchase-requests/edit/${request.id}`}
                                        deleteUrl="/api/purchase-requests/destroy/"
                                        deleteId={request.id}
                                        getToken={token}
                                        returnUrl="/purchase-requests"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
