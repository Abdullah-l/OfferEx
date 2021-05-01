import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OfferPrompt = (props) => {
  const [message, setMessage] = useState("");

  const [price, setPrice] = useState(props.price);
  const [ErrorText, setErrorText] = useState("");

  const handleClose = () => {
    props.setOpen(false);
  };
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handlePriceChange = (e) => {

    e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value === '' || e.target.value > 0 && e.target.value < 999999){
      setPrice(e.target.value);
      setErrorText("");
    }


  };

  const handleSubmit = () => {
    if (price === "") 
    setErrorText("Offer Amount cannot be empty");
    else
     props.addOfferHandler(message, parseInt(price));
  };

  return (
    <Dialog
      fullWidth
      TransitionComponent={Transition}
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Make an offer</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Note: You can not redact your offer once it's sent. If the seller
          accepts your offer, you are obligated to purchase the item.
        </DialogContentText>
        <TextField
          error={!!ErrorText.length}
          helperText={ErrorText}
          required
          autoFocus
          margin="dense"
          id="price"
          label="Offer Amount"
          type="text"
          value={price}
          onChange={handlePriceChange}
          InputProps={{
            startAdornment: (
              <InputAdornment style={{ color: "black" }} position="start">
                $
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        <TextField
          margin="dense"
          id="message"
          label="Optional Message"
          type="text"
          value={message}
          onChange={handleMessageChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfferPrompt;
