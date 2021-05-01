// Shows all listing details, map, and public offers

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Row, Col } from "antd";
import ProductImage from "./Sections/ProductImage";
import ProductInfo from "./Sections/ProductInfo";
import { addOffer } from "../../../_actions/user_actions";
import { auth } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { MapContainer, TileLayer,
    Circle,
    Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import de from "./Sections/de.css";
import L from "leaflet";
import { Button } from "@material-ui/core";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function DetailProductPage(props) {
  const dispatch = useDispatch();
  const [Product, setProduct] = useState([]);
  const [PublicOffers, setPublicOffers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [latLong, setLatLong] = useState([]);

  useEffect(() => {
    const productId = props.match.params.productId;

    Axios.get(`/api/product/products_by_id?id=${productId}&type=single`).then(
      (response) => {
        if (response.status === 200) {
        getPublicOffers(productId);
        setProduct(response.data[0]);
        setLoading(false);
        Axios.put(`/api/product/updateViews?id=${productId}`);
        }
        else{
            alert("Unable to fetch listing, try again later.")
        }
      }
    );
  }, [props.match.params.productId]);

  const getPublicOffers = (productId) => {
    const variables = {
      productId: productId,
    };
    Axios.get("/api/offer/getPublicOffers", { params: variables }).then(
      (response) => {
        if (response.status === 200) {
          setPublicOffers(response.data.offers);
        } else {
          console.log("Failed to fetch offers data");
        }
      }
    );
  };

  // This is for getting user's location via browser API
  // Not used atm, might use later 
  
  // const getLocation = () => {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //       setLatLong([position.coords.latitude, position.coords.longitude]);
  //     });
  // }

  const addOfferHandler = (offerData) => {
    if (offerData.buyer) {
      dispatch(addOffer(offerData)).then(response => {
        if (response.payload.success) {
          alert("Offer sent successfully!");
          getPublicOffers(offerData.product);
        } else {
          alert(response.payload.err.errmsg);
        }
      })
    } else {
      alert("Please log in to make an offer");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="postPage" style={{ width: "100%", padding: "3rem 4rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <h1>{Product.title}</h1>
      </div>

      <br />

      <Row gutter={[16, 16]}>
        <Col lg={8} xs={24}>
          <ProductImage detail={Product} />
        <br/>

        {Product.location.length === 0 ? null: 
          <MapContainer
            center={[Product.location[0], Product.location[1]]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

    <Circle
      center={[Product.location[0], Product.location[1]]}
      pathOptions={{ color: 'green', weight: 1, fillOpacity: 0.4 }}
      radius={1000}>
    </Circle>
          </MapContainer>
        }
        <p>This map shows an approximate location of the item.</p>
        </Col>
        <Col lg={14} xs={24} offset={1}>
          <ProductInfo
            addOffer={addOfferHandler}
            detail={Product}
            user={props.user}
            PublicOffers={PublicOffers}
          />
        </Col>
      </Row>
      <Row></Row>
    </div>
  );
}

export default DetailProductPage;
