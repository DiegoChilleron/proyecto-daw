import Link from "next/link";
import { titleFont } from "@/config/fonts";

export const Footer = () => {
    return (

        <footer>
            <Link href="/">
                <span className={`${titleFont.className} antialiased font-bold`}>Diego </span>
                <span>| Shop</span>
                <span>© {new Date().getFullYear()}</span>
            </Link>

            <Link href="/legal/legal-notice" className="mx-3">Política Legal & Privacidad</Link>
            <Link href="/legal/cookies-policy" className="mx-3">Política de Cookies</Link>

        </footer>
    )
}
