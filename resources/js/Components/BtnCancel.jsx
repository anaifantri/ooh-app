import { Link } from "@inertiajs/react";
import Svg from "@/Components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function BtnCancel({ backUrl }) {
    return (
        <Link href={backUrl} className="flex-all-center button-danger mx-1">
            <Svg title="Back" c={"w-5 fill-current mx-1"}>
                <DeleteSvg />
            </Svg>
            <span className="mx-1">Cancel</span>
        </Link>
    );
}
