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
    const [purchaseOrders, setPurchaseOrders] = useState(null);

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/purchase-orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPurchaseOrders(response.data);
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
                    title="Daftar Pemesanan Barang / PO"
                    addTitle="Tambah Pemesanan Barang / PO"
                    addUrl="/purchase-orders/create"
                />
                {message && (
                    <SuccessMessage message={message} duration="3000" />
                )}
                {failed && <FailedMessage message={failed} duration="3000" />}
                <table className="table-auto mt-2 w-full">
                    <thead>
                        <tr className="h-10 bg-stone-300">
                            <th className="th-center w-10" rowSpan={2}>
                                No.
                            </th>
                            <th className="th-center" colSpan={3}>
                                Data Permintaan
                            </th>
                            <th className="th-center" colSpan={6}>
                                Data Po
                            </th>
                            <th className="th-center w-20" rowSpan={2}>
                                Action
                            </th>
                        </tr>
                        <tr className="h-10 bg-stone-300">
                            <th className="th-center w-28">Tanggal</th>
                            <th className="th-center w-36">No. Permintaan</th>
                            <th className="th-center w-40">Gudang</th>
                            <th className="th-center w-28">Tgl. PO</th>
                            <th className="th-center w-36">No. PO</th>
                            <th className="th-center w-40">Supplier</th>
                            <th className="th-center w-32">Sub. Total</th>
                            <th className="th-center w-24">Tax</th>
                            <th className="th-center w-32">Grand Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseOrders.map((order, index) => (
                            <tr className="bg-white" key={index}>
                                <td className="td-center">{index + 1}</td>
                                <td className="td-center">
                                    {FormattedDateShort(
                                        order.purchase_request.created_at,
                                    )}
                                </td>
                                <td className="td-center">
                                    {order.purchase_request.number}
                                </td>
                                <td className="td-center">
                                    {order.purchase_request.warehouse.name}
                                </td>
                                <td className="td-center">
                                    {FormattedDateShort(order.created_at)}
                                </td>
                                <td className="td-center">{order.number}</td>
                                <td className="td-center">
                                    {order.supplier.name}
                                </td>
                                <td className="td-right">
                                    {rupiah(order.sub_total)}
                                </td>
                                <td className="td-right">
                                    {rupiah(order.tax)}
                                </td>
                                <td className="td-right">
                                    {rupiah(order.grand_total)}
                                </td>
                                <td className="td-center">
                                    <TdAction
                                        showUrl={`/purchase-orders/show/${order.id}`}
                                        editUrl={`/purchase-orders/edit/${order.id}`}
                                        deleteUrl="/api/purchase-orders/destroy/"
                                        deleteId={order.id}
                                        getToken={token}
                                        returnUrl="/purchase-orders"
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
