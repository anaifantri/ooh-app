import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";

export default function Index() {
    const dataUser = JSON.parse(localStorage.getItem("dataUser"));
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex w-full justify-center items-center p-6">
                <label htmlFor="">Welcome {dataUser.name}</label>
            </div>
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
