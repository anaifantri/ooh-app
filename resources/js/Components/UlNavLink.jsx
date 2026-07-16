import ArrowSvg from "@/Assets/Svg/ArrowSvg";
import Svg from "@/Components/Svg";

// 1. Membuat komponen Wrapper (Parent)
export default function UlNavLink({ title, c, children }) {
    return (
        <ul className={c}>
            {children}
            <span className="text-xs ml-2">{title}</span>
            <Svg
                title="Arrow"
                c={
                    "nav-svg  ml-1 transform transition-transform duration-300 group-hover:rotate-180"
                }
            >
                <ArrowSvg />
            </Svg>
        </ul>
    );
}
