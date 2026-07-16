import HeaderLogo from "@/Components/HeaderLogo";
import NavBar from "@/Components/NavBar";
import RightNav from "@/Components/RightNav";

export default function HeaderLayout() {
    return (
        <header className="flex items-center top-0 left-0 w-full z-50">
            <div className="grid grid-cols-2 sm:grid-cols-16 w-full gap-0 bg-stone-800 p-2 text-sm">
                <HeaderLogo />
                <NavBar />
                <RightNav />
            </div>
        </header>
    );
}
