import clsx from "clsx";
import { IoCardOutline } from "react-icons/io5";


interface Props {
    isPaid: boolean;
}

export const OrderStatus = ({ isPaid }: Props) => {
    return (
        <div className={
            clsx(
                "order-status",
                {
                    'order-status--pending': !isPaid,
                    'order-status--paid': isPaid,
                }
            )}>
            <IoCardOutline size={30} />
            <span className="order-status__text">{isPaid ? 'Pagado' : 'Pendiente de pago'}</span>
        </div>
    );
};
