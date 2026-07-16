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
    const [suppliers, setSuppliers] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/suppliers", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuppliers(response.data);
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
                    title="Daftar Supplier"
                    addTitle="Tambah Supplier"
                    addUrl="/suppliers/create"
                />
                {message && (
                    <SuccessMessage message={message} duration="3000" />
                )}
                {failed && <FailedMessage message={failed} duration="3000" />}
                <table className="table-auto mt-2 w-full">
                    <thead>
                        <tr className="h-10 bg-stone-300">
                            <th className="th-center w-10">No.</th>
                            <th className="th-center w-20">Kode</th>
                            <th className="th-center w-32">Katagori</th>
                            <th className="th-center w-60">Nama</th>
                            <th className="th-center">Alamat</th>
                            <th className="th-center w-32">No. Telepon</th>
                            <th className="th-center w-32">No. Hp.</th>
                            <th className="th-center">Email</th>
                            <th className="th-center w-32">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier, index) => (
                            <tr className="bg-white" key={index}>
                                <td className="td-center">{index + 1}</td>
                                <td className="td-center">{supplier.code}</td>
                                <td className="td-center">
                                    {supplier.supplier_category.name}
                                </td>
                                <td className="td-center">{supplier.name}</td>
                                <td className="td-left">{supplier.address}</td>
                                <td className="td-center">{supplier.phone}</td>
                                <td className="td-center">{supplier.mobile}</td>
                                <td className="td-center">{supplier.email}</td>
                                <td className="td-center">
                                    <TdAction
                                        showUrl={`/suppliers/show/${supplier.id}`}
                                        editUrl={`/suppliers/edit/${supplier.id}`}
                                        deleteUrl="/api/suppliers/destroy/"
                                        deleteId={supplier.id}
                                        getToken={token}
                                        returnUrl="/suppliers"
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
