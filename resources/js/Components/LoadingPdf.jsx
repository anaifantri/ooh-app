import Svg from "@/Components/Svg";
import SpinSvg from "@/Assets/Svg/SpinSvg";
import { QRCode } from "react-qrcode-logo";

export default function LoadingPdf({ url }) {
    return (
        <>
            <div style={{ display: "none" }}>
                <QRCode id="pdf-qr-code" value={url} />
            </div>
            <div className="flex w-full min-h-screen rounded-3xl z-50 justify-center items-center p-6 bg-slate-400/25">
                <div>
                    <div className="flex-all-center w-full">
                        <Svg
                            title="Back"
                            c={"w-5 fill-current mx-1 animate-spin"}
                        >
                            <SpinSvg />
                        </Svg>
                    </div>
                    <span className="flex-all-center w-full">
                        {" "}
                        Loading data...
                    </span>
                </div>
            </div>
        </>
    );
}
