"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gql, useMutation } from "@apollo/client";

const COMMIT_SUBSCRIPTION_PAYMENT = gql`
  mutation commitSubscriptionPayment($token: String!) {
    commitSubscriptionPayment(token: $token) {
      clientEmail
      saleToken
    }
  }
`;

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenWs = searchParams.get("token_ws");

  const [commitPayment] = useMutation(COMMIT_SUBSCRIPTION_PAYMENT);

  useEffect(() => {
    if (!tokenWs) return;

    commitPayment({
      variables: { token: tokenWs },
    })
      .then((res) => {
        const { clientEmail, saleToken } =
          res.data.commitSubscriptionPayment;

        router.replace(
          `/register?email=${encodeURIComponent(
            clientEmail,
          )}&saleToken=${saleToken}`,
        );
      })
      .catch(() => {
        router.replace("/payment/error");
      });
  }, [tokenWs]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Confirmando tu pago…</h2>
      <p>No cierres esta ventana.</p>
    </div>
  );
}
