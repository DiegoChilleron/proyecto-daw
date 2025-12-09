import { titleFont } from "@/config/fonts";
import Link from "next/link";
import Image from "next/image";

export const PageNotFound = () => {
    return (
        <div className="not-found">

            <div className="not-found__content">
                <h2 className={`${titleFont.className} not-found__title`}>404</h2>
                <p className="not-found__text">Whoops! Lo sentimos mucho.</p>
                <p className="font-light">
                    <span>Puedes regresar al </span>

                    <Link href="/" className="not-found__link">inicio</Link>

                </p>
            </div>
            <div className="not-found__image-container">
                <Image src="/imgs/starman_750x750.png"
                alt="Starman" 
                className="not-found__image"
                width={550}
                height={550} />

</div>

        </div>
    )
}
