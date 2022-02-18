import { sandboxURLs } from "./../constants";
import { generateAccessToken } from "./../tokens";

const capturePaymentforOrder = async (orderId) => {
  const { ORDERS_API_URL } = sandboxURLs;
  const accessToken = await generateAccessToken();

  const response = await fetch(`${ORDERS_API_URL}/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

const handler = async (req, res) => {
  console.log(`Order ID- ${JSON.stringify(req.query.orderId)}`);
  const { id, status } = await capturePaymentforOrder(req.query.orderId);
  res.status(200).json({ id, status });
};

export default handler;
