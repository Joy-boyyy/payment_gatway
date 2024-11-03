import React, { useContext, useEffect } from "react";
import { MyContextFun } from "./context/store";
import axios from "axios";

const App = () => {
  const price1 = 500;
  const price2 = 300;

  const { inc, setInc, total } = useContext(MyContextFun);

  console.log(" inc =======>", inc);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const letsBuy = async () => {
    if (total > 0) {
      try {
        const paymentRes = await axios.post("http://localhost:8000/order", {
          amount: total * 100,
          currency: "INR",
          receipt: "234563423121",
        });

        console.log("paymentRes ==>", paymentRes);
        console.log("Order ID from server:", paymentRes.data.order.id);

        // payment gatway "UI" code
        verifyFun(paymentRes);
      } catch (err) {
        console.log("Front End Error ===> ", err.response.data.message || err);
      }
    }
  };

  const verifyFun = (paymentRes) => {
    var options = {
      key: "rzp_test_zLBMlOiZ0PWrd4", // Enter the Key ID generated from the Dashboard
      amount: total * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Anand Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: paymentRes.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      handler: async function (response) {
        // const body = { ...response };

        console.log("response ==>", response);
        try {
          const validateResponse = await axios.post(
            "http://localhost:8000/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (validateResponse) {
            console.log(validateResponse.message);
          }
        } catch (err) {
          console.log(err.rensponse || err);
        }
      },

      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "9000090000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  };

  return (
    <div className="W-[100%]">
      <div className="w-[100%] flex items-center gap-3 mb-2 bg-slate-500 p-3">
        <p> To buy </p>
        <button type="button" className="bg-blue-300 p-2" onClick={letsBuy}>
          BUY
        </button>
      </div>
      <div className="w-[100%] flex gap-2 ">
        <div className="basis-[20%] p-3 min-h-[15rem] flex flex-col justify-center items-center border-2 border-black">
          <img
            src="https://img.freepik.com/premium-psd/3d-rendering-bag-accessories_23-2151476539.jpg"
            alt="bag"
            className="w-[10rem] h-[10rem]"
          />
          <h2>Card 1</h2>
          <p>{price1}</p>
          <button
            type="button"
            className="bg-blue-300 p-3 rounded-xl"
            onClick={() =>
              setInc((prevData) => [
                ...prevData,
                { cartID: 1, price: price1, title: "cart1" },
              ])
            }
          >
            cart
          </button>
        </div>

        <div className="basis-[20%] p-3 min-h-[15rem] flex flex-col justify-center border-2 border-black items-center">
          <img
            src="https://img.freepik.com/free-psd/3d-rendering-bag-accessories-icon_23-2151476551.jpg"
            alt="glass"
            className="w-[10rem] h-[10rem]"
          />
          <h2>Card 2</h2>
          <p>{price2}</p>
          <button
            type="button"
            className="bg-blue-300 p-3 rounded-xl"
            onClick={() =>
              setInc((prevData) => [
                ...prevData,
                { cartID: 2, price: price2, title: "cart2" },
              ])
            }
          >
            cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
