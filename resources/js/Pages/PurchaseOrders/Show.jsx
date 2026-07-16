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
    const [purchaseOrder, setPurchaseOrder] = useState(null);
    const [purchaseRequest, setPurchaseRequest] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    };

    useEffect(() => {
        const getUrl = window.location.href;
        const splitUrl = getUrl.split("/");
        const ordertId = splitUrl[splitUrl.length - 1];

        const fetchData = async () => {
            try {
                const response = await api.get(
                    "/api/purchase-orders/" + ordertId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setPurchaseOrder(response.data);
                setProducts(response.data.products);
                setPurchaseRequest(response.data.purchase_request);
                setSupplier(response.data.supplier);
                setWarehouse(response.data.purchase_request.warehouse);
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
                    titleShow="Data PO / Pemesanan Barang"
                    url="/purchase-orders"
                    getId={purchaseOrder.id}
                    token={token}
                />
                <SuccessMessage message={message} duration="3000" />

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-2 border border-stone-500 rounded-lg bg-white">
                        <div className="flex items-center mt-2">
                            <label className="w-32">Nomor</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {purchaseOrder.number}
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">Tanggal PO</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {FormattedDateLong(purchaseOrder.created_at)}
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">Dibuat Oleh</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {purchaseOrder.user.name}
                            </label>
                        </div>
                        <div className="flex items-center mt-4">
                            <label className="w-60 font-semibold underline">
                                Alamat Pengiriman
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">Nama Gudang</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {warehouse.name}
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">Alamat</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {warehouse.address}
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">No. Telepon</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {warehouse.phone ? warehouse.phone : "-"}
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">No. Hp.</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {warehouse.mobile ? warehouse.mobile : "-"}
                            </label>
                        </div>
                    </div>
                    <div className="p-2 border border-stone-500 rounded-lg bg-white">
                        <div className="flex items-center mt-2">
                            <label className="w-32">Kode Supplier</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {supplier.code}
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <label className="w-32">Nama Supplier</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {supplier.name}
                            </label>
                        </div>
                        <div className="flex items-start mt-2">
                            <label className="w-32">Alamat</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {supplier.address}
                            </label>
                        </div>
                        <div className="flex items-start mt-2">
                            <label className="w-32">No. Telepon</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {supplier.phone ? supplier.phone : "-"}
                            </label>
                        </div>
                        <div className="flex items-start mt-2">
                            <label className="w-32">No. Hp</label>
                            <label>:</label>
                            <label className="w-80 font-semibold ml-2">
                                {supplier.mobile ? supplier.mobile : "-"}
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
                                    <th className="th-center w-20">Jumlah</th>
                                    <th className="th-center w-20">Satuan</th>
                                    <th className="th-center w-24">Harga</th>
                                    <th className="th-center w-32">Total</th>
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
                                            {product.pivot.qty}
                                        </td>
                                        <td className="td-center">
                                            {product.unit}
                                        </td>
                                        <td className="td-right">
                                            {rupiah(product.pivot.price)}
                                        </td>
                                        <td className="td-right">
                                            {rupiah(
                                                product.pivot.price *
                                                    product.pivot.qty,
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="table-auto w-full">
                            <tbody>
                                <tr className="bg-white">
                                    <td
                                        className="border text-right px-2 font-semibold"
                                        colSpan={5}
                                    >
                                        Sub Total
                                    </td>
                                    <td className="td-right font-semibold w-32">
                                        {rupiah(purchaseOrder.sub_total)}
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td
                                        className="border text-right px-2 font-semibold"
                                        colSpan={5}
                                    >
                                        PPN
                                    </td>
                                    <td className="td-right font-semibold w-32">
                                        {rupiah(purchaseOrder.tax)}
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td
                                        className="border text-right px-2 font-semibold"
                                        colSpan={5}
                                    >
                                        Grand Total
                                    </td>
                                    <td className="td-right font-semibold w-32">
                                        {rupiah(purchaseOrder.grand_total)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
