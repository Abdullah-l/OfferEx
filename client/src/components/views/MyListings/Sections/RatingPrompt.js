import React, {useState} from "react";
import Axios from "axios";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { ratingCalc, labels } from "../../../utils/RatingCalc";



const useStyles = makeStyles((theme) => ({
  rating: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  },
}));
export default function SimpleRating(props) {
  const classes = useStyles();

  const offer = props.offer;

  const [message, setMessage] = useState("");

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const onRatingSubmit = () => {
    Axios.put("/api/offer/acceptOffer", {
      offerId: offer._id,
      productId: offer.product,
      buyerId: offer.buyer._id,
      message: message
    }).then((response) => {
      if (response.status === 200) {
        alert("Offer accepted!");
        props.offerClose(props.prodIdx);
        props.refreshPage(offer._id);
      } else {
        alert("Error accepting offer, try again later");
      }
    });
  };
  const onOfferReject = () => {
    Axios.put("/api/offer/rejectOffer", {
      offerId: offer._id,
      productId: offer.product,
      message: message
    }).then((response) => {
      if (response.status === 200) {
        alert("Offer rejected!");
        props.offerClose(props.prodIdx);
        props.refreshPage(offer._id);
      } else {
        alert("Error rejecting offer, try again later");
      }
    });
  };

  return (
    <div>
    {props.type === 'accept' &&
      <Box className={classes.rating} component="fieldset" mb={3} borderColor="transparent">
        <Typography>
          Provide your contact information to {offer.buyer.name}!
        </Typography>
        <br/>

        <TextField
          required
          helperText={"Use this field to add your contact info"}
          margin="dense"
          id="message"
          label="Message"
          type="text"
          value={message}
          onChange={handleMessageChange}
          fullWidth
        />
        <br/>
        <Button disabled={!message.length} onClick={onRatingSubmit} color="primary" variant="contained">
          Submit
        </Button>
        <br/>
        <Typography >{`Note: Once you click submit, the listing will be marked as sold. This action is final.`}</Typography>
      </Box>
    }
    {props.type === 'reject' &&
      <Box className={classes.rating} component="fieldset" mb={3} borderColor="transparent">
        <Typography>
          Please provide a reason for rejecting {offer.buyer.name}'s offer!
        </Typography>
        <br/>
        <TextField
          margin="dense"
          id="message"
          label="Message"
          type="text"
          value={message}
          onChange={handleMessageChange}
          fullWidth
          required
        />
        <br/>
        <Button disabled={!message.length} onClick={onOfferReject} color="primary" variant="contained">
          Submit
        </Button>
        <br/>
        <Typography >{`Note: This action is final.`}</Typography>
      </Box>
    }

    </div>
  );
}
