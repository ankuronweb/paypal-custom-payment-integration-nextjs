import { sandboxURLs } from "./../constants";
import { generateAccessToken } from "./../tokens";

const createOrder = async (req) => {
  const { ORDERS_API_URL } = sandboxURLs;
  const accessToken = await generateAccessToken();
  const payload = {
    intent: "CAPTURE",
    // change this block and dynamically get the order amount from session
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "10.00"
        }
      }
    ]
  };
  const response = await fetch(ORDERS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  console.log(`Create Order Call- ${JSON.stringify(data)}`);
  return data;
};

const handler = async (req, res) => {
  const { id, status } = await createOrder(req);
  res.status(200).json({ id, status });
};

export default handler;
