import { useUserOrderCreate } from "@app/mobi-web/hooks/user";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import PixButton from "./pix-button";
import { addRetrieveCount } from "./retrieve-count";

export default function PaymentButton({ bizId, paymentChannel, paymentType, loading, onLoadingChange }: { bizId: string, paymentChannel: PaymentChannel, paymentType: PaymentType, loading: boolean, onLoadingChange: (v: boolean) => void }) {
  const { t } = useTranslation('', { keyPrefix: 'payment' });
  const [searchParams, _setSearchParams] = useSearchParams();
  const { fetchUserOrderCreate } = useUserOrderCreate();

  const paymentInfo: Record<PaymentType, { name: string, image: string }> = {
    [PaymentType.Card]: {
      name: t('credit-debit-card'),
      image: 'https://s03.bluearcshow.com/images/B0_Card.png',
    },
    [PaymentType.GooglePay]: {
      name: 'Google Pay',
      image: 'https://s03.bluearcshow.com/images/Google_Pay_Global.png',
    },
    [PaymentType.ApplePay]: {
      name: 'Apple Pay',
      image: 'https://s03.bluearcshow.com/images/Apple_Pay_Global.png',
    },
    [PaymentType.Paypal]: {
      name: 'PayPal',
      image: 'https://s03.bluearcshow.com/images/paypal.webp',
    },
    [PaymentType.Pix]: {
      name: 'Pix',
      image: 'https://s03.bluearcshow.com/images/PIX_BR.png',
    },
    [PaymentType.MercadoPago]: {
      name: 'Mercado Pago',
      image: 'https://s03.bluearcshow.com/images/Mercado_Pago_BR.png',
    },
  }

  const handleClickPayment = async (paymentChannel: PaymentChannel, paymentType: PaymentType) => {
    if (loading) return;
    onLoadingChange(true);
    if (paymentChannel === PaymentChannel.Paypal) {
      paymentType = PaymentType.Card
    }
    try {
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

      addRetrieveCount("order");
      window.location.href = result.redirectUrl;
    } catch {
      onLoadingChange(false);
    }
  }

  const handlePixSubmit = async (data: { cpf: string; firstName: string; lastName: string }) => {
    if (loading) return;
    onLoadingChange(true);
    try {
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
        paymentChannel: paymentChannel,
        paymentType: PaymentType.Pix,
        pixelId: Number(searchParams.get('p')) || 0,
        reback: `${location.pathname}${location.search || ''}`,
        ad: JSON.stringify(ad),
        pixCPF: data.cpf,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      addRetrieveCount("order");
      window.location.href = result.redirectUrl;
    } catch {
      onLoadingChange(false);
    }
  }

  return (
    <>
      {
        paymentType === PaymentType.Pix ? <PixButton onSubmit={handlePixSubmit} /> :
          <button
            className="w-full h-[52px] bg-[rgba(255,255,255,0.1)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative flex items-center justify-start border-none cursor-pointer"
            onClick={() => handleClickPayment(paymentChannel, paymentType)}
          >
            <img src={paymentInfo[paymentType].image} alt={paymentInfo[paymentType].name} className="w-8" />
            <span className="ml-2">
              {paymentInfo[paymentType].name}
            </span>
          </button>
      }
    </>
  )
}
