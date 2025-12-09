import Link from "next/link";
import { titleFont } from "@/config/fonts";

export const Footer = () => {
    return (

        <footer>
            <Link href="/">
                <span className={`${titleFont.className} footer__logo`}>Diego </span>
                <span>| Shop</span>
                <span>© {new Date().getFullYear()}</span>
            </Link>

            <Link href="/legal/legal-notice" className="footer__link">Política Legal & Privacidad</Link>
            <Link href="/legal/cookies-policy" className="footer__link">Política de Cookies</Link>

        </footer>
    )
}
