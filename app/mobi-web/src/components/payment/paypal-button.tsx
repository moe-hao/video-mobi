import { useVideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { useUserOrderApprove, useUserOrderClose, useUserOrderCreate } from "@app/mobi-web/hooks/user";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { SkuType } from "@lib/common/consts/sku";
import type { SkuListItem } from "@lib/common/dto/sku";
import { DISPATCH_ACTION, PayPalButtons, usePayPalScriptReducer, type PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { useEffect } from "react";

const styles: PayPalButtonsComponentProps["style"] = {
    tagline: false,
    shape: "rect",
    layout: "horizontal",
    color: "white",
    label: "paypal",
    height: 52,
};

export default function PayPalButton({ skuInfo }: { skuInfo: SkuListItem }) {
    const { productInfo } = useVideoMobiContext();

    const { fetchUserOrderCreate } = useUserOrderCreate();
    const { fetchUserOrderApprove } = useUserOrderApprove();
    const { fetchUserOrderClose } = useUserOrderClose();

    const [{ options }, dispatch] = usePayPalScriptReducer();

    const currency = productInfo?.currency || "USD";

    useEffect(() => {
        if (skuInfo.skuType === SkuType.Subscription) {
            dispatch({
                type: DISPATCH_ACTION.RESET_OPTIONS,
                value: { ...options, currency: currency, vault: true, intent: "subscription" },
            });
        } else {
            dispatch({
                type: DISPATCH_ACTION.RESET_OPTIONS,
                value: { ...options, currency: currency, vault: false, intent: "capture" },
            });
        }
    }, [currency]);

    const handlePaypalCreateOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
        const result = await fetchUserOrderCreate({
            sku: skuInfo.bizId,
            paymentChannel: PaymentChannel.Paypal,
            paymentType: PaymentType.Card,
        });
        return result.paymentId;
    }

    const handlePaypalOnApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
        await fetchUserOrderApprove({
            paymentChannel: PaymentChannel.Paypal,
            paymentId: data.paymentID || "",
            subscriptionNo: data.subscriptionID || "",
            paymentType: (data as any).paymentSource,
        });
    }

    const handlePaypalOnCancel: PayPalButtonsComponentProps["onCancel"] = async (data) => {
        await fetchUserOrderClose({
            paymentChannel: PaymentChannel.Paypal,
            paymentId: data.orderID as string,
        })
    }

    const handlePaypalCreateSubscription: PayPalButtonsComponentProps["createSubscription"] = async () => {
        const result = await fetchUserOrderCreate({
            sku: skuInfo.bizId,
            paymentChannel: PaymentChannel.Paypal,
            paymentType: PaymentType.Card,
        });
        return result.subscriptionNo;
    }

    if (skuInfo.skuType === SkuType.Subscription) {
        return (
            <div className="rounded-[16px] overflow-hidden [&_iframe]:!rounded-[16px]">
                <PayPalButtons
                    style={styles}
                    createSubscription={handlePaypalCreateSubscription}
                    onApprove={handlePaypalOnApprove}
                    onCancel={handlePaypalOnCancel}
                />
            </div>
        )
    }

    return (
        <div className="rounded-[16px] overflow-hidden [&_iframe]:!rounded-[16px]">
            <PayPalButtons
                style={styles}
                createOrder={handlePaypalCreateOrder}
                onApprove={handlePaypalOnApprove}
                onCancel={handlePaypalOnCancel}
            />
        </div>
    );
}
