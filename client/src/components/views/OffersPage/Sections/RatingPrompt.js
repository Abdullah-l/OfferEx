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
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);

  const offer = props.offer;

  const onRatingSubmit = () => {
    Axios.put("/api/offer/addRating", {
      offerId: offer._id,
      productId: offer.product._id,
      userId: props.mode === 'seller' ? offer.buyer._id : offer.seller._id,
      rating: value,
      sold : props.mode === 'seller' ? 2 : 3
    }).then((response) => {
      if (response.status === 200) {
        alert("Rating Submitted!");
        props.offerClose(props.index);
        props.setRatingSent(true);
      } else {
        alert("Error sending rating, try again later");
      }
    });
  };


  return (
    <div>
      <Box className={classes.rating} component="fieldset" mb={3} borderColor="transparent">
        <Typography>
          Please rate your experience {props.mode === 'seller' ? `selling to ${offer.buyer.name}!` : `buying from ${offer.seller.name}!`} 
        </Typography>
        <br/>

        {value !== null && <Box color='#523100'>{labels[hover !== -1 ? hover : value]}</Box>}
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        />
        <br/>
        {value === 0 ? <p>Click on the stars to choose a rating.</p> : null}
        {/* <TextField
          margin="dense"
          id="message"
          label="Optional Message"
          type="text"
          value={message}
          onChange={handleMessageChange}
          fullWidth
        /> */}
        <br/>
        <Button disabled={!value} onClick={onRatingSubmit} color="primary" variant="contained">
          Submit
        </Button>
        <br/>
        <Typography >{`Note: This action is final.`}</Typography>
      </Box>
    

    </div>
  );
}
