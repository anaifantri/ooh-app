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
    const [companies, setCompanies] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/companies", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCompanies(response.data);
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
                    title="Daftar Perusahaan"
                    addTitle="Tambah Data Perusahaan"
                    addUrl="/companies/create"
                />
                {message && (
                    <SuccessMessage message={message} duration="3000" />
                )}
                {failed && <FailedMessage message={failed} duration="3000" />}
                <table className="table-auto mt-2 w-full">
                    <thead>
                        <tr className="h-10 bg-stone-300">
                            <th className="th-center w-10">No.</th>
                            <th className="th-center w-20">Initial</th>
                            <th className="th-center w-48">Nama Perusahaan</th>
                            <th className="th-center">Alamat</th>
                            <th className="th-center w-28">No. Telepon</th>
                            {/* <th className="th-center w-28">No. Hp.</th> */}
                            <th className="th-center">Email</th>
                            {/* <th className="th-center">Website</th> */}
                            <th className="th-center w-32">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company, index) => (
                            <tr className="bg-white" key={index}>
                                <td className="td-center">{index + 1}</td>
                                <td className="td-center">{company.initial}</td>
                                <td className="td-center">{company.name}</td>
                                <td className="td-left">{company.address}</td>
                                <td className="td-center">{company.phone}</td>
                                {/* <td className="td-center">{company.mobile}</td> */}
                                <td className="td-center">{company.email}</td>
                                {/* <td className="td-center">{company.website}</td> */}
                                <td className="td-center">
                                    <TdAction
                                        showUrl={`/companies/show/${company.id}`}
                                        editUrl={`/companies/edit/${company.id}`}
                                        deleteUrl="/api/companies/destroy/"
                                        deleteId={company.id}
                                        getToken={token}
                                        returnUrl="/companies"
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
