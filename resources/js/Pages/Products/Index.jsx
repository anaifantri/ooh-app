import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

import { api } from "@/apiService";
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
    const [products, setProducts] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/products", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(response.data);
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
                    title="Daftar Produk"
                    addTitle="Tambah Produk"
                    addUrl="/products/create"
                />
                {message && (
                    <SuccessMessage message={message} duration="3000" />
                )}
                {failed && <FailedMessage message={failed} duration="3000" />}
                <table className="table-auto mt-2 w-full">
                    <thead>
                        <tr className="h-10 bg-stone-300">
                            <th className="th-center w-10">No.</th>
                            <th className="th-center w-32">Kode</th>
                            <th className="th-center w-32">Katagori</th>
                            <th className="th-center w-60">Nama</th>
                            <th className="th-center w-16">satuan</th>
                            <th className="th-center w-32">Harga</th>
                            <th className="th-center">Deskripsi</th>
                            <th className="th-center w-32">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr className="bg-white" key={index}>
                                <td className="td-center">{index + 1}</td>
                                <td className="td-center">{product.code}</td>
                                <td className="td-center">
                                    {product.product_category.name}
                                </td>
                                <td className="td-center">{product.name}</td>
                                <td className="td-center">{product.unit}</td>
                                <td className="td-center">
                                    {product.price
                                        ? product.price.toLocaleString()
                                        : "-"}
                                </td>
                                <td className="td-left">
                                    {product.description}
                                </td>
                                <td className="td-center">
                                    <TdAction
                                        showUrl={`/products/show/${product.id}`}
                                        editUrl={`/products/edit/${product.id}`}
                                        deleteUrl="/api/products/destroy/"
                                        deleteId={product.id}
                                        getToken={token}
                                        returnUrl="/products"
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
