import Svg from "@/Components/Svg";
import BtnBack from "@/Components/BtnBack";
import BtnPdf from "@/Components/BtnPdf";
import BtnEdit from "@/Components/BtnEdit";
import BtnDelete from "@/Components/BtnDelete";

export default function HeaderShow({ titleShow, url, getId, token }) {
    return (
        <>
            <div className="grid grid-cols-2 gap-1 w-full border-b mt-4">
                <div className="flex w-full font-semibold p-1 text-lg">
                    Detail {titleShow}
                </div>
                <div className="flex justify-end w-full mx-1 p-1">
                    <BtnBack backUrl={url} />
                    <BtnPdf pdfUrl={`${url}/pdf/${getId}`} />
                    <BtnEdit editUrl={`${url}/edit/${getId}`} />
                    <BtnDelete
                        deleteUrl={`/api${url}/destroy/`}
                        deleteId={getId}
                        getToken={token}
                        returnUrl={url}
                    />
                </div>
            </div>
        </>
    );
}
