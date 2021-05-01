import React, { useEffect, useState } from "react";
import { Table, Button, Descriptions, Badge } from "antd";
import { catagories } from "../../../Datas";
import { ratingCalc, labels } from "../../../utils/RatingCalc";
import OfferPrompt from "./OfferPrompt";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import ReactTimeAgo from "react-time-ago";

import de from "./de.css";

function ProductInfo(props) {
  const [Product, setProduct] = useState({});

  const [open, setOpen] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const rating = isLoading ? 0 : ratingCalc(Product.writer.rating);

  const handleClickOpen = () => {
    if (props.user.userData.isAuth) {
      if (props.user.userData._id === props.detail.writer._id)
        alert("You can't make an offer on your own listing.");
      else setOpen(true);
    } else alert("Please log in");
  };

  useEffect(() => {
    setProduct(props.detail);
    setLoading(false);
  }, []);

  const addOfferHandler = (message, price) => {
    if (price < 0) {
      alert("Please enter a valid offer amount!");
      return;
    }
    const offerData = {
      product: props.detail._id,
      seller: props.detail.writer._id,
      buyer: props.user.userData._id,
      message: message,
      price: price,
    };

    props.addOffer(offerData);
    setOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { Column } = Table;

  const offerStates = ['Pending', 'Accepted', 'Rejected'];
  const data = props.PublicOffers.map((offer, idx) => ({
    key: idx,
    Offer: "$" + offer.price,
    Status: offer.status === 0 ?
    <Badge status="processing" text={offerStates[offer.status]} />
    :
    offer.status === 1 ?
    <Badge status="success" text={offerStates[offer.status]} />
    :
    <Badge status="error" text={offerStates[offer.status]} />
    ,
    Sent: <ReactTimeAgo date={new Date(offer.createdAt)} locale="en-US" />,
    "Buyer's Rating": (
      <Box className={"rateBox"}>
        {labels[ratingCalc(offer.buyer.rating)]}
        <Box display="flex">
          <Rating
            readOnly
            value={ratingCalc(offer.buyer.rating)}
            size="small"
          />
          <span>{`(${offer.buyer.rating.length})`}</span>
        </Box>
      </Box>
    ),
  }));

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Listing details
      </Typography>
      <Descriptions column={3}>
        <Descriptions.Item label="Seller" span={1}>
          {Product.title ? Product.writer.name : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item span={1}>

            <Box display="flex">
            <span style={{color: 'black', display: 'flex', alignItems: 'center', marginRight: '15px'}} >Rating:  </span>
            <Box className={"rateBox"}>
            <span>{labels[rating]}</span>
            <Box display="flex">
              <Rating
                readOnly
                value={ratingCalc(Product.writer.rating)}
                size="small"
              />
              <span>{`(${Product.writer.rating.length})`}</span>
              </Box>

            </Box>
          </Box>
        </Descriptions.Item>
        <Descriptions.Item label="Price" span={1}> ${Product.price}</Descriptions.Item>
        <Descriptions.Item label="Posted">
          {" "}
          <ReactTimeAgo date={new Date(Product.createdAt)} locale="en-US" />
        </Descriptions.Item>
        <Descriptions.Item label="Views" span={1}> {Product.views}</Descriptions.Item>
        <Descriptions.Item label="Status" span={1}> {Product.sold === 0 ? 'Available' : "Sold"}</Descriptions.Item>
        <Descriptions.Item label="Category" span={3}>
          {" "}
          {Product.title ? catagories[Product.catagories - 1].name : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={3}>
          {`${Product.description}`}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />

      <Typography variant="h6" gutterBottom>
        Current offers
      </Typography>
      <Table dataSource={data} pagination={false}>
        <Column title="Offer" dataIndex="Offer" key="Offer" />
        <Column title="Sent" dataIndex="Sent" key="Sent" />
        <Column title="Status" dataIndex="Status" key="Status" />
        <Column
          title="Buyer's Rating"
          dataIndex="Buyer's Rating"
          key="Buyer's Rating"
        />
      </Table>

      <br />
      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {Product.sold === 0 && <Button
          size="large"
          shape="round"
          type="danger"
          onClick={handleClickOpen}
        >
          Make an offer
        </Button>}
        <OfferPrompt
          open={open}
          setOpen={setOpen}
          addOfferHandler={addOfferHandler}
          price={Product.price}
        />
      </div>
    </div>
  );
}

export default ProductInfo;
