import DashboardLayout from "@/Layouts/DashboardLayout";

export default function Index() {
    return (
        <>
            <div className="flex w-full justify-center items-center p-6">
                <label htmlFor="">Daftar Project</label>
            </div>
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
