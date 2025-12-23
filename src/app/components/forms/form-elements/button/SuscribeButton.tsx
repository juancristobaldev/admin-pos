import { useMutation } from '@apollo/client';
import { useState } from 'react';

type Props = {
  subscriptionId: string | null;
  clientEmail: string;
  amount:number;
};

import { gql } from '@apollo/client';

export const CREATE_SUBSCRIPTION_PAYMENT = gql`
  mutation CreateSubscriptionPayment(
    $subscriptionId: String!
    $clientEmail: String!
    $returnUrl: String!
    $amount: Int!
  ) {
    createSubscriptionPayment(
      subscriptionId: $subscriptionId
      clientEmail: $clientEmail
      returnUrl: $returnUrl
      amount: $amount
    ) {
      id
      token
      webpayUrl
    }
  }
`;

export default function SubscribeButton({
  subscriptionId,
  clientEmail,
  amount
}: Props) {
  const [loadingRedirect, setLoadingRedirect] = useState(false);

  const [createPayment, { loading, error }] = useMutation(
    CREATE_SUBSCRIPTION_PAYMENT,
  );

  const handleSubscribe = async () => {
    try {
      setLoadingRedirect(true);

      const { data } = await createPayment({
        variables: {
          subscriptionId,
          clientEmail,
          returnUrl: `${window.location.origin}/purchase/callback`,
          amount
        },
      });

      if (!data?.createSubscriptionPayment) {
        throw new Error('No se pudo crear el pago');
      }

      const { webpayUrl, token } = data.createSubscriptionPayment;

      // 🔁 Redirección a Transbank
      window.location.href = `${webpayUrl}?token_ws=${token}`;
    } catch (err) {
      console.error(err);
      alert('Error al iniciar el pago');
      setLoadingRedirect(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading || loadingRedirect}
        className="px-4 py-2 rounded bg-black text-white"
      >
        {loading || loadingRedirect
          ? 'Redirigiendo a Webpay...'
          : 'Suscribirme'}
      </button>

      {error && (
        <p className="text-red-500 mt-2">
          Error: {error.message}
        </p>
      )}
    </div>
  );
}
