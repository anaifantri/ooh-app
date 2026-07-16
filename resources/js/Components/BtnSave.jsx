import Svg from "@/Components/Svg";
import SaveSvg from "@/Assets/Svg/SaveSvg";
import SpinSvg from "@/Assets/Svg/SpinSvg";

export default function BtnSave({ p }) {
    return (
        <button
            type="submit"
            disabled={p}
            className={
                p
                    ? "flex-all-center button-disabled"
                    : "flex-all-center button-success cursor-pointer"
            }
        >
            {p ? (
                <Svg title="Back" c={"w-4 fill-current mx-1 animate-spin"}>
                    <SpinSvg />
                </Svg>
            ) : (
                <Svg title="Save" c={"w-4 fill-current mx-1"}>
                    <SaveSvg />
                </Svg>
            )}
            <span className="mx-1">{p ? "Saving..." : "Save"}</span>
        </button>
    );
}
