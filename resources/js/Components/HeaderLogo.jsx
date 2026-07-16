import Logo from "@/Assets/Img/logo-vista-media.png";

export default function HeaderLogo() {
    return (
        <div className="flex px-4 items-center sm:col-span-2">
            <img src={Logo} alt="" className="flex mx-2 w-10" />
            <span className="flex text-white mx-1">Vista</span>
            <span className="flex text-red-500 mx-1">Media</span>
        </div>
    );
}
