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
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
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
            <div>
                <HeaderIndex
                    title="Daftar Pengguna"
                    addTitle="Tambah Pengguna"
                    addUrl="/users/create"
                />
                {message && (
                    <SuccessMessage message={message} duration="3000" />
                )}
                {failed && <FailedMessage message={failed} duration="3000" />}
                <table className="table-auto mt-2">
                    <thead>
                        <tr className="h-10 bg-stone-300">
                            <th className="th-center w-10">No.</th>
                            <th className="th-center w-40">Nama</th>
                            <th className="th-center w-28">Username</th>
                            <th className="th-center w-60">Email</th>
                            <th className="th-center w-24">No. Hp.</th>
                            <th className="th-center w-32">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr className="bg-white" key={index}>
                                <td className="td-center">{index + 1}</td>
                                <td className="td-center">{user.name}</td>
                                <td className="td-center">{user.username}</td>
                                <td className="td-center">{user.email}</td>
                                <td className="td-center">{user.phone}</td>
                                <td className="td-center">
                                    <TdAction
                                        showUrl={`/users/show/${user.id}`}
                                        editUrl={`/users/edit/${user.id}`}
                                        deleteUrl="/api/users/destroy/"
                                        deleteId={user.id}
                                        getToken={token}
                                        returnUrl="/users"
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
