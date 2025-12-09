'use client';

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onQuantityChanged: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {

    const onValueChange = (value: number) => {
        if (quantity + value < 1 || quantity + value > 9) return;
        onQuantityChanged(quantity + value);
    }

    return (
        <div className="quantity-selector">
            <button className="quantity-selector__button" onClick={() => onValueChange(-1)}>
                <IoRemoveCircleOutline size={30} />
            </button>
            <span className="quantity-selector__value">{quantity}</span>
            <button className="quantity-selector__button" onClick={() => onValueChange(1)}>
                <IoAddCircleOutline size={30} />
            </button>
        </div>
    )
}
