import { Link } from "@inertiajs/react";

import NavLink from "@/Components/NavLink";
import LiNavLink from "@/Components/LiNavLink";
import Svg from "@/Components/Svg";

import RequestSvg from "@/Assets/Svg/RequestSvg";
import PurchaseSvg from "@/Assets/Svg/PurchaseSvg";
import ReceiptSvg from "@/Assets/Svg/ReceiptSvg";
import ReceiveSvg from "@/Assets/Svg/ReceiveSvg";
import SettingSvg from "@/Assets/Svg/SettingSvg";
import StockSvg from "@/Assets/Svg/StockSvg";
import OutSvg from "@/Assets/Svg/OutSvg";
import ArrowSvg from "@/Assets/Svg/ArrowSvg";
import HomeSvg from "@/Assets/Svg/HomeSvg";

export default function NavBar() {
    return (
        <div className="hidden sm:flex justify-center items-center mx-2 col-span-12 ">
            <div className="grid grid-cols-8 gap-2 w-full">
                <Link
                    className="flex justify-center items-center w-full text-teal-300 relative hover:text-teal-600 text-xs"
                    href={"/dashboard"}
                >
                    <Svg title="Request" c={"nav-svg"}>
                        <HomeSvg />
                    </Svg>
                    <span className="text-xs ml-2">Dashboard</span>
                </Link>
                <NavLink
                    title="Permintaan"
                    c="nav-link group"
                    navSvg={<RequestSvg />}
                >
                    <LiNavLink
                        title="List Permintaan"
                        c="li-nav-link"
                        url="/purchase-requests"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Laporan" c="li-nav-link" url="">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                </NavLink>
                <NavLink
                    title="Pemesanan"
                    c="nav-link group"
                    navSvg={<PurchaseSvg />}
                >
                    <LiNavLink
                        title="List Pemesanan"
                        c="li-nav-link"
                        url="/purchase-orders"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Laporan" c="li-nav-link" url="">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                </NavLink>
                <NavLink
                    title="Penerimaan"
                    c="nav-link group"
                    navSvg={<ReceiveSvg />}
                >
                    <LiNavLink
                        title="List Penerimaan"
                        c="li-nav-link"
                        url="/inbounds"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Laporan" c="li-nav-link" url="">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                </NavLink>
                <NavLink
                    title="Faktur"
                    c="nav-link group"
                    navSvg={<ReceiptSvg />}
                >
                    <LiNavLink
                        title="Faktur Pembelian"
                        c="li-nav-link"
                        url="/purchase-invoices"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Laporan" c="li-nav-link" url="">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                </NavLink>
                <NavLink
                    title="Pengeluaran"
                    c="nav-link group"
                    navSvg={<OutSvg />}
                >
                    <LiNavLink
                        title="Pengeluaran Barang"
                        c="li-nav-link"
                        url="/expenditures"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Laporan" c="li-nav-link" url="">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                </NavLink>
                <NavLink title="Stok" c="nav-link group" navSvg={<StockSvg />}>
                    <LiNavLink title="Stok Gudang" c="li-nav-link" url="">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Kartu Stok" c="li-nav-link" url="">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                </NavLink>
                <NavLink
                    title="Pengaturan"
                    c="nav-link group"
                    navSvg={<SettingSvg />}
                >
                    <LiNavLink
                        title="Perusahaan"
                        c="li-nav-link"
                        url="/companies"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Gudang" c="li-nav-link" url="/warehouses">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink
                        title="Katagori Produk"
                        c="li-nav-link"
                        url="/product-categories"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Produk" c="li-nav-link" url="/products">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink
                        title="Katagori Supplier"
                        c="li-nav-link"
                        url="/supplier-categories"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink
                        title="Supplier"
                        c="li-nav-link"
                        url="/suppliers"
                    >
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="Project" c="li-nav-link" url="/projects">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                    <LiNavLink title="User" c="li-nav-link" url="/users">
                        <Svg
                            title="Arrow"
                            c={"nav-svg w-5 fill-current rotate-270"}
                        >
                            <ArrowSvg />
                        </Svg>
                    </LiNavLink>
                </NavLink>
            </div>
        </div>
    );
}
