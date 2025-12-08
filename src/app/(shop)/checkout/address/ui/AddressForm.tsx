'use client'


import { Address, Country } from "@/interfaces";
import { useAddressStore } from "@/store";
import { useEffect } from "react";
import { deleteUserAddress, setUserAddress } from "@/actions";
import { authClient } from "@/lib/auth-client";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";

type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    rememberAddress: boolean;
}

interface Props {
    countries: Country[];
    userStoredAddress?: Partial<Address>;
}

export const AddressForm = ({ countries, userStoredAddress = {} }: Props) => {

    const router = useRouter();

    const { handleSubmit, register, formState: { isValid }, reset } = useForm<FormInputs>({
        defaultValues: {
            ...(userStoredAddress as any),
            rememberAddress: true,
        }
    });

    const { data: session } = authClient.useSession();

    const setAdress = useAddressStore(state => state.setAdress);
    const address = useAddressStore(state => state.address);


    useEffect(() => {
        if (address.firstName) {
            reset(address);
        }
    }, [address, reset]);


    const onSubmit = async (data: FormInputs) => {


        const { rememberAddress, ...restAddress } = data;
        setAdress(data);
        if (rememberAddress) {
            await setUserAddress(restAddress, session!.user.id);
        } else {
            await deleteUserAddress(session!.user.id);
        }


        router.push('/checkout');

    };

    return (
        <form className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2" id="address-form" onSubmit={handleSubmit(onSubmit)}>


            <div className="flex flex-col mb-2">
                <span>Nombres</span>
                <input type="text" className="p-2 rounded-md bg-gray-200" {...register('firstName', { required: true })} />
            </div>

            <div className="flex flex-col mb-2">
                <span>Apellidos</span>
                <input type="text" className="p-2 rounded-md bg-gray-200" {...register('lastName', { required: true })} />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección</span>
                <input type="text" className="p-2 rounded-md bg-gray-200" {...register('address', { required: true })} />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección 2 (opcional)</span>
                <input type="text" className="p-2 rounded-md bg-gray-200" {...register('address2')} />
            </div>


            <div className="flex flex-col mb-2">
                <span>Código postal</span>
                <input type="text" className="p-2 rounded-md bg-gray-200" {...register('postalCode', { required: true })} />
            </div>

            <div className="flex flex-col mb-2">
                <span>Ciudad</span>
                <input type="text" className="p-2 rounded-md bg-gray-200" {...register('city', { required: true })} />
            </div>

            <div className="flex flex-col mb-2">
                <span>País</span>
                <select className="p-2 rounded-md bg-gray-200" {...register('country', { required: true })}>
                    <option value="">[ Seleccione ]</option>
                    {
                        countries.map(country => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))
                    }
                </select>
            </div>

            <div className="flex flex-col mb-2">
                <span>Teléfono</span>
                <input type="text" className="p-2 rounded-md bg-gray-200" {...register('phone', { required: true })} />
            </div>



            <div className="flex flex-col mb-2 sm:mt-1">

                <div className="inline-flex items-center mb-10">
                    <label
                        className="relative flex cursor-pointer items-center rounded-full p-3"
                        htmlFor="checkbox"
                        data-ripple-dark="true"
                    >
                        <input
                            type="checkbox"
                            className="before:content[''] peer border-gray-500 relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                            id="checkbox"
                            {...register('rememberAddress')}
                        />
                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 opacity-0 transition-opacity peer-checked:opacity-100">
                            <FaCheck size={16} />
                        </div>
                    </label>
                    <span>¿Recordar dirección?</span>
                </div>

                <button
                    disabled={!isValid}
                    // href='/checkout'
                    type="submit"
                    className={clsx({
                        'btn-primary': isValid,
                        'btn-disabled': !isValid,
                    })}
                >
                    Siguiente
                </button>
            </div>


        </form>
    )
}
