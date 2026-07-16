import HeaderLayout from "@/Layouts/HeaderLayout";

export default function DashboardLayout({ children }) {
    return (
        <>
            <HeaderLayout />
            <main>
                <div className="flex w-full min-h-screen justify-center p-4 text-sm bg-linear-to-b from-teal-50 to-teal-100 z-0">
                    {children}
                </div>
            </main>
        </>
    );
}
