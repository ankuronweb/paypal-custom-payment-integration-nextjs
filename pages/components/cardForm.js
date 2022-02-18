import styles from "./CardForm.module.css";
import { useState } from "react";
import {
  PayPalScriptProvider,
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  usePayPalHostedFields
} from "@paypal/react-paypal-js";

import { TailSpin } from "react-loader-spinner";

export const CardForm = (props) => {
  const [loader, showLoader] = useState(false);
  const [success, showSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState();

  const SubmitPayment = () => {
    // Here declare the variable containing the hostedField instance
    const { cardFields } = usePayPalHostedFields();

    const submitHandler = () => {
      if (typeof cardFields.submit !== "function") return; // validate that `submit()` exists before using it
      showLoader(true);
      showSuccess(false);
      cardFields
        .submit({
          // The full name as shown in the card and billing address
          cardholderName: "John Wick"
        })
        .then((order) => {
          const { orderId } = order;
          fetch(`/api/payments/${orderId}`)
            .then((response) => response.json())
            .then((data) => {
              showLoader(false);
              showSuccess(true);
              setTransactionData(data);
              // Inside the data you can find all the information related to the payment
            })
            .catch((err) => {
              // Handle any error
            });
        });
    };

    return (
      <button onClick={submitHandler} className="btn btn-primary">
        Pay
      </button>
    );
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": props.clientID,
        "data-client-token": props.clientToken,
        components: "hosted-fields"
      }}
    >
      <PayPalHostedFieldsProvider
        createOrder={() => {
          // Here define the call to create and order
          return fetch("/api/payments")
            .then((response) => response.json())
            .then((order) => order.id)
            .catch((err) => {
              // Handle any error
            });
        }}
      >
        <section className={styles.container}>
          <h3 style={{ textAlign: "center", margin: 10 }}>
            PayPal Custom Checkout
            <small className="text-muted"> With Orders API</small>
          </h3>
          <p style={{ textAlign: "center" }}>
            Test credit card numbers can be found{" "}
            <a
              href="https://developer.paypal.com/api/nvp-soap/payflow/integration-guide/test-transactions/#processors-other-than-paypal"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <div className={styles.card_container}>
            <label htmlFor="card-number">Card Number</label>
            <PayPalHostedField
              id="card-number"
              hostedFieldType="number"
              options={{
                selector: "#card-number",
                placeholder: "4111 1111 1111 1111"
              }}
              className={styles.card_field}
            />
            <label htmlFor="cvv">CVV</label>
            <PayPalHostedField
              id="cvv"
              hostedFieldType="cvv"
              options={{
                selector: "#cvv",
                placeholder: "123"
              }}
              className={styles.card_field}
            />
            <label htmlFor="expiration-date">Expiration Date</label>
            <PayPalHostedField
              id="expiration-date"
              hostedFieldType="expirationDate"
              className={styles.card_field}
              options={{
                selector: "#expiration-date",
                placeholder: "MM/YY"
              }}
            />
            {loader && <TailSpin height="50" width="50" color="#0d6efd" />}
            {!loader && <SubmitPayment />}
            {success && (
              <p style={{ color: "green", margin: "10px" }}>
                Transaction Completed! {JSON.stringify(transactionData)}
              </p>
            )}
          </div>
        </section>
      </PayPalHostedFieldsProvider>
    </PayPalScriptProvider>
  );
};
