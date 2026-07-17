import { useUserOrderCreate } from "@app/mobi-web/hooks/user";
import { Button } from "@heroui/react";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import PixButton from "./pix-button";

export default function PaymentButton({ bizId, paymentChannel, paymentType }: { bizId: string, paymentChannel: PaymentChannel, paymentType: PaymentType }) {
  const { t } = useTranslation('', { keyPrefix: 'payment' });
  const [searchParams, _setSearchParams] = useSearchParams();
  const { fetchUserOrderCreate } = useUserOrderCreate();

  const paymentInfo: Record<PaymentType, { name: string, image: string }> = {
    [PaymentType.Card]: {
      name: t('credit-debit-card'),
      image: 'https://i.bluearcshow.com/images/B0_Card.png',
    },
    [PaymentType.GooglePay]: {
      name: 'Google Pay',
      image: 'https://i.bluearcshow.com/images/Google_Pay_Global.png',
    },
    [PaymentType.ApplePay]: {
      name: 'Apple Pay',
      image: 'https://i.bluearcshow.com/images/Apple_Pay_Global.png',
    },
    [PaymentType.Paypal]: {
      name: 'PayPal',
      image: 'https://i.bluearcshow.com/images/paypal.webp',
    },
    [PaymentType.Pix]: {
      name: 'Pix',
      image: 'https://i.bluearcshow.com/images/PIX_BR.png',
    },
    [PaymentType.MercadoPago]: {
      name: 'Mercado Pago',
      image: 'https://i.bluearcshow.com/images/Mercado_Pago_BR.png',
    },
  }

  const handleClickPayment = async (paymentChannel: PaymentChannel, paymentType: PaymentType) => {
    if (paymentChannel === PaymentChannel.Paypal) {
      paymentType = PaymentType.Card
    }

    const ad = {
      ad_id: searchParams.get('creative_id') || '',
      adset_id: searchParams.get('adset_id') || '',
      campaign_id: searchParams.get('campaign_id') || '',
      fbclid: searchParams.get('fbclid') || '',
      ttclid: searchParams.get('ttclid') || '',
      collectionId: searchParams.get('collectionId') || '',
    }

    const result = await fetchUserOrderCreate({
      sku: bizId,
      paymentChannel,
      paymentType,
      pixelId: Number(searchParams.get('p')) || 0,
      reback: `${location.pathname}${location.search || ''}`,
      ad: JSON.stringify(ad),
      pixCPF: '',
      firstName: '',
      lastName: '',
    });

    window.location.href = result.redirectUrl;
  }

   const handlePixSubmit = async (data: { cpf: string; firstName: string; lastName: string }) => {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout');
    }
    const ad = {
      ad_id: searchParams.get('creative_id') || '',
      adset_id: searchParams.get('adset_id') || '',
      campaign_id: searchParams.get('campaign_id') || '',
      fbclid: searchParams.get('fbclid') || '',
      ttclid: searchParams.get('ttclid') || '',
      collectionId: searchParams.get('collectionId') || '',
    }

    const result = await fetchUserOrderCreate({
      sku: bizId,
      paymentChannel: PaymentChannel.Payssion,
      paymentType: PaymentType.Pix,
      pixelId: Number(searchParams.get('p')) || 0,
      reback: `${location.pathname}${location.search || ''}`,
      ad: JSON.stringify(ad),
      pixCPF: data.cpf,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    window.location.href = result.redirectUrl;
  }

  return (
    <>
      {
        paymentChannel === PaymentChannel.Payssion ? <PixButton onSubmit={handlePixSubmit} /> :
          <Button
            size="lg"
            className="w-full h-[52px] bg-[rgba(255,255,255,0.1)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative justify-start"
            onPress={() => handleClickPayment(paymentChannel, paymentType)}
          >
            <img src={paymentInfo[paymentType].image} alt={paymentInfo[paymentType].name} className="w-8" />
            <span className="ml-2">
              {paymentInfo[paymentType].name}
            </span>
          </Button>
      }
    </>
  )
}
