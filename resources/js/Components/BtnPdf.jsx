import { Link } from "@inertiajs/react";
import Svg from "@/Components/Svg";
import PdfSvg from "@/Assets/Svg/PdfSvg";

export default function BtnPdf({ pdfUrl }) {
    return (
        <Link href={pdfUrl} className="flex-all-center button-success mx-1">
            <Svg title="Pdf" c={"w-5 fill-current mx-1"}>
                <PdfSvg />
            </Svg>
            <span className="mx-1">Pdf</span>
        </Link>
    );
}
