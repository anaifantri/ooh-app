import { Link } from "@inertiajs/react";
import Svg from "@/Components/Svg";

import AddSvg from "@/Assets/Svg/AddSvg";

export default function HeaderIndex({ title, addTitle, addUrl }) {
    return (
        <div className="grid grid-cols-3 border-b w-full">
            <label className="flex font-semibold p-1 text-lg w-full col-span-2">
                {title}
            </label>
            <div className="flex justify-end items-center w-full">
                <Link href={addUrl} className="flex-all-center button-primary">
                    <Svg title="Add" c={"w-6 fill-current"}>
                        <AddSvg />
                    </Svg>
                    <span className="mx-1">{addTitle}</span>
                </Link>
            </div>
        </div>
    );
}
