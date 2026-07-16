import { Link } from "@inertiajs/react";

// 1. Membuat komponen Wrapper (Parent)
export default function ChildNavLink({ title, c, url, children }) {
    return (
        <Link className={c} href={url}>
            {children}
            <span className="ml-2 text-xs">{title}</span>
        </Link>
    );
}
