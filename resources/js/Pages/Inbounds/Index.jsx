import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
import FormattedDateShort from "@/Utils/FormattedDateShort";
import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderIndex from "@/Components/HeaderIndex";
import TdAction from "@/Components/TdAction";
import SuccessMessage from "@/Components/SuccessMessage";
import FailedMessage from "@/Components/FailedMessage";
import LoadingData from "../../Components/LoadingData";

export default function Index() {
    const page = usePage();
    const message = page.props.message;
    const failed = page.props.failed;
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inbounds, setInbounds] = useState(null);

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/inbounds", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInbounds(response.data);
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
            <div className="w-325">
                <HeaderIndex
                    title="Daftar Penerimaan Barang"
                    addTitle="Tambah Penerimaan Barang"
                    addUrl="/inbounds/create"
                />
                {message && (
                    <SuccessMessage message={message} duration="3000" />
                )}
                {failed && <FailedMessage message={failed} duration="3000" />}
                <table className="table-auto mt-2 w-full">
                    <thead>
                        <tr className="h-10 bg-stone-300">
                            <th className="th-center w-10">No.</th>
                            <th className="th-center w-40">Gudang</th>
                            <th className="th-center w-36">No. Penerimaan</th>
                            <th className="th-center w-28">Tanggal</th>
                            <th className="th-center w-36">No. PO</th>
                            <th className="th-center w-28">Tgl. PO</th>
                            <th className="th-center w-40">Supplier</th>
                            <th className="th-center w-20">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inbounds.map((inbound, index) => (
                            <tr className="bg-white" key={index}>
                                <td className="td-center">{index + 1}</td>
                                <td className="td-center">
                                    {inbound.warehouse.name}
                                </td>
                                <td className="td-center">{inbound.number}</td>
                                <td className="td-center">
                                    {FormattedDateShort(inbound.date)}
                                </td>
                                <td className="td-center">
                                    {inbound.purchase_order.number}
                                </td>
                                <td className="td-center">
                                    {FormattedDateShort(
                                        inbound.purchase_order.created_at,
                                    )}
                                </td>
                                <td className="td-center">
                                    {inbound.purchase_order.supplier.name}
                                </td>
                                <td className="td-center">
                                    <TdAction
                                        showUrl={`/inbounds/show/${inbound.id}`}
                                        editUrl={`/inbounds/edit/${inbound.id}`}
                                        deleteUrl="/api/inbounds/destroy/"
                                        deleteId={inbound.id}
                                        getToken={token}
                                        returnUrl="/inbounds"
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
