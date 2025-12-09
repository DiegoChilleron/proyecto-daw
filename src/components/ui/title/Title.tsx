import { titleFont } from "@/config/fonts";

interface Props {
    title: string;
    subtitle?: string;
    className?: string;
}

export const Title = ({ title, subtitle, className }: Props) => {
    return (
        <div className={`title ${className}`}>
            <h1 className={`${titleFont.className} title__heading`}>{title}</h1>

            {subtitle && (<h3 className="title__subtitle">{subtitle}</h3>)}

        </div>
    )
}
