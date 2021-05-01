// Sell your item page which has a form to add a listing

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Typography, message, Input, Icon } from "antd";
import FileUpload from "../../utils/FileUpload";
import Axios from "axios";
import { catagories } from "../../Datas";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const { Title } = Typography;
const { TextArea } = Input;

const Catagories = catagories.map((item) => ({
  key: item._id,
  value: item.name,
}));

const URL = "https://ip.nf/me.json";

function UploadProductPage(props) {
  const [TitleValue, setTitleValue] = useState("");
  const [DescriptionValue, setDescriptionValue] = useState("");
  const [PriceValue, setPriceValue] = useState("");
  const [CategoryValue, setCategoryValue] = useState(1);

  const [Images, setImages] = useState([]);

  const [position, setPosition] = useState([]);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const [isLoading, setLoading] = useState(true);
  const [info, setInfo] = useState({ ip: "" });
  useEffect(() => {
    fetch(URL, { method: "get" })
      .then((response) => response.json())
      .then((data) => {
        setInfo({ ...data });
        setPosition([data.ip.latitude, data.ip.longitude]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (markerRef.current) {
        const marker = markerRef.current;
        marker.openPopup();
      }
    });
  }, [isLoading]);

  const onTitleChange = (event) => {
    setTitleValue(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setDescriptionValue(event.target.value);
  };

  const onPriceChange = (e) => {
    e.target.value.replace(/[^0-9]/g, "");
    if (
      e.target.value === "" ||
      (e.target.value > 0 && e.target.value < 999999)
    ) {
      setPriceValue(e.target.value);
    }
  };

  const onCatagoriesSelectChange = (event) => {
    setCategoryValue(event.target.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };
  const onSubmit = (event) => {
    event.preventDefault();

    if (
      !TitleValue ||
      !DescriptionValue ||
      !PriceValue ||
      !CategoryValue
    ) {
      return alert("Fill all the fields please!");
    }

    if (Images.length === 0)
      return alert("Please add one image at least!")

    const variables = {
      writer: props.user.userData._id,
      title: TitleValue,
      description: DescriptionValue,
      price: parseInt(PriceValue),
      images: Images,
      catagories: CategoryValue,
      location: [position.lat, position.lng],
    };

    Axios.post("/api/product/uploadProduct", variables).then((response) => {
      if (response.data.success) {
        alert("Product Successfully Uploaded");
        props.history.push("/");
      } else {
        alert("Failed to upload Product");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> Start Selling Today!</Title>
      </div>

      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {/* DropZone */}
        <FileUpload refreshFunction={updateImages} />

        <br />
        <br />
        <br />
        <TextField
          id="Title"
          label="Title"
          variant="outlined"
          margin="normal"
          onChange={onTitleChange}
          value={TitleValue}
          placeholder="Enter a meaningful title"
          helperText={`${TitleValue.length}/${100}`}
          inputProps={{
            maxLength: 100,
          }}
          fullWidth
        />
        <br />
        <TextField
          id="description"
          label="Description"
          margin="normal"
          multiline
          rows={4}
          rowsMax={Infinity}
          variant="outlined"
          onChange={onDescriptionChange}
          value={DescriptionValue}
          placeholder="Describe your item"
          helperText={`${DescriptionValue.length}/${1024}`}
          inputProps={{
            maxLength: 1024,
          }}
          fullWidth
        />
        <br />
        <TextField
          helperText={"The price you wish to sell this item for."}
          required
          margin="normal"
          id="price"
          label="Price"
          type="text"
          value={PriceValue}
          onChange={onPriceChange}
          InputProps={{
            startAdornment: (
              <InputAdornment style={{ color: "black" }} position="start">
                $
              </InputAdornment>
            ),
          }}
        />
        <TextField
          style={{ marginLeft: "18%" , width: '50%'}}
          id="category"
          select
          label="Category"
          margin="normal"
          value={CategoryValue}
          onChange={onCatagoriesSelectChange}
          helperText="Select a category that matches your item"
        >
          {Catagories.map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {item.value}
            </MenuItem>
          ))}
        </TextField>
        <br />
        <br />
        <p>
          Based on your IP address, your location was approximated to be in{" "}
          {info.ip.city}, {info.ip.country}
        </p>
        {isLoading ? null : (
          <MapContainer
            center={[info.ip.latitude, info.ip.longitude]}
            zoom={13}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={position}
              ref={markerRef}
              autoPan
            >
              <Popup minWidth={90}>
                <span>{"Drag pin to your location"}</span>
              </Popup>
            </Marker>
          </MapContainer>
        )}
        <br />
        <br />
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          style={{ width: "15%", marginLeft: "40%" }}
        >
          Submit
        </Button>
      </form>
      <br />
      <br />
    </div>
  );
}

export default UploadProductPage;
