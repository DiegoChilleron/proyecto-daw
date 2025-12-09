import { Title, PayPalButton, OrderStatus, ProductImage } from "@/components";
import { getOrderById } from "@/actions/order/get-order-by-id";
import { redirect } from "next/navigation";
import { currencyFormat } from "@/utils";
import { DeploymentStatusBadge } from "./ui/DeploymentStatusBadge";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrdersByIdPage({ params }: Props) {

  const { id } = await params;

  const { ok, order } = await getOrderById(id);

  if (!ok) { redirect('/orders') };


  const address = order!.orderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split('-').at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order?.isPaid ?? false} />

            {/* Items */}
            {
              order!.orderItems.map(item => (
                <div key={item.product.slug} className="flex mb-5 p-4 bg-gray-50 rounded-lg">
                  <ProductImage 
                    src={item.product.productImages[0]?.url} 
                    alt={item.product.title} 
                    width={100} 
                    height={100} 
                    className="mr-5 rounded w-[100px] h-[100px] object-cover" 
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.title}</p>
                    <p className="text-sm text-gray-600">{currencyFormat(item.price)} x {item.quantity}</p>
                    <p className="font-bold">Subtotal: {currencyFormat(item.price * item.quantity)}</p>
                    
                    {/* Estado del despliegue */}
                    <div className="mt-2">
                      <DeploymentStatusBadge 
                        status={item.deploymentStatus} 
                        deploymentUrl={item.deploymentUrl}
                      />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">{address!.firstName} {address!.lastName}</p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>{address!.city}, {address!.countryId}</p>
              <p>{address!.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>
            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2 ">

              <span>No. Productos</span>
              <span className="text-right">{order?.itemsInOrder === 1 ? '1 artículo' : `${order?.itemsInOrder} artículos`}</span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subTotal)}</span>


              <span>Impuestos (21%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(order!.total)}</span>

            </div>

            <div className="mt-5 mb-2 w-full">

              {order?.isPaid ? (
                <OrderStatus isPaid={order?.isPaid ?? false} />
              ) : (
                <PayPalButton amount={order!.total} orderId={order!.id} />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 