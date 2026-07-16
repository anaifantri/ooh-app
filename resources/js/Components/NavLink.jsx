import Svg from "@/Components/Svg";
import UlNavLink from "@/Components/UlNavLink";

// 1. Membuat komponen Wrapper (Parent)
export default function NavLink({ title, c, children, navSvg }) {
    return (
        <nav className={`group ${c}`}>
            <UlNavLink title={title} c={c}>
                <Svg className="navSvg" title="Request" c={"nav-svg"}>
                    {navSvg}
                </Svg>
            </UlNavLink>
            <div className="hidden group-hover:block absolute top-4 pt-5">
                <div className="w-max border-t-2 border-t-stone-800 rounded-b-lg border border-slate-50 bg-teal-50 px-2">
                    {children}
                </div>
            </div>
        </nav>
    );
}
