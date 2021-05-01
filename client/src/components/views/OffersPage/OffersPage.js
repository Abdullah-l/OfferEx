// Offer History page which shows sent/received offers

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Icon, Col, Row } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import { catagories, price } from "../../Datas";
import OfferTabs from "./Sections/OfferTabs";
import RatingPrompt from "./Sections/RatingPrompt";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const { Meta } = Card;

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  acceptBtn: {
    // margin: theme.spacing(1),
    float: "left",
  },
  rejectBtn: {
    // margin: theme.spacing(1),
    float: "right",
  },
  btnGrp: {
    display: "flex",
    alignContent: "center",
    margin: "auto",
  },
}));

function OffersPage(props) {
  const classes = useStyles();
  const [receivedOffers, setReceivedOffers] = useState([[], [], []]);
  const [sentOffers, setSentOffers] = useState([[], [], []]);
  const [activeBtn, setActiveBtn] = useState({A: true, B:false});
  const [RatingSent, setRatingSent] = useState(false);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState({});


  useEffect(() => {
    const variables = {
      userId: "",
      mode: "buyer",
    };
    if (props.user.userData) {
      variables.userId = props.user.userData._id;
      getProducts(variables);
    }
  }, [props.user, RatingSent]);

  const getProducts = (variables) => {
    Axios.get("/api/offer/getOffers", { params: variables }).then(
      (response) => {
        if (response.status === 200) {
          const o = filterOffers(response.data.offers);

          if (variables.mode === "buyer") {
            setSentOffers(o);
            variables.mode = "seller";
            getProducts(variables);
          } else if (variables.mode === "seller") setReceivedOffers(o);
        } else {
          alert("Failed to fetch offers data");
        }
      }
    );
  };

  const filterOffers = (offers) => {
    const pendingOffers = [],
      acceptedOffers = [],
      rejectedOffers = [];

    offers.forEach((offer) => {
      if (offer.status == 0) pendingOffers.push(offer);
      else if (offer.status == 1) acceptedOffers.push(offer);
      else if (offer.status == 2) rejectedOffers.push(offer);
    });
    return [pendingOffers, acceptedOffers, rejectedOffers];
  };

  const offerClickOpen = (index) => {
    setOpen({ ...open, [index]: true });
  };

  const offerClose = (index) => {
    setOpen({ ...open, [index]: false });
  };

  const renderCards = (subOffer, typ, mode) =>
    subOffer.map((offer, index) => {
      console.log(offer);
      let img = "https://source.unsplash.com/random";
      if (offer.product.images[0]) {
        img =
          "http://localhost:5000/uploads/" + offer.product.images[0].slice(8);
      }
      return (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={4}>
          <Card className={classes.card}>
            <a href={`/listing/${offer.product._id}`}>
              <CardMedia className={classes.cardMedia} image={img} />
            </a>

            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h6" component="h2" noWrap>
                {offer.product.title}
              </Typography>
              {mode === "buyer" ? (
                <Typography>Seller: {offer.seller.name}</Typography>
              ) : (
                <Typography>Buyer: {offer.buyer.name}</Typography>
              )}
              <Typography>{`Offer: $${offer.price}`}</Typography>
              {offer.message && <Typography gutterBottom={offer.product.sold > 0}>{`Message: ${offer.message}`}</Typography>}

              {(mode === 'seller' && offer.product.sold === 1 && offer.status === 1) && 
              <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => offerClickOpen(index)}
                  >
                    Rate {offer.buyer.name}
                  </Button> }
              {(mode === 'buyer' && offer.product.sold === 2 && offer.status === 1) && 
              <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => offerClickOpen(index)}
                  >
                    Rate {offer.seller.name}
                  </Button> }

                  <Dialog
                    open={open[index] ? open[index] : false}
                    onClose={() => offerClose(index)}
                    aria-labelledby={index + " title"}
                    aria-describedby={index + " description"}
                    fullWidth
                    maxWidth='xs'
                  >
                    <DialogTitle id={index + " title"}>
                      {`Rate your ${mode}`}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText
                        component={"div"}
                        id={index + " description"}
                      >
                        {<RatingPrompt offer={offer} mode={mode} index={index}
                         offerClose={offerClose} setRatingSent={setRatingSent}/>}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => offerClose(index)} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>   
              
            </CardContent>
          </Card>
        </Grid>
      );
    });

  const renderOfferType = (subOffer, typ, mode) => {
    console.log(subOffer);
    return (
      <Row gutter={[16, 16]}>
        <Col lg={24}>
          {subOffer.length === 0 ? (
            <div
              style={{
                display: "flex",
                height: "300px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>You don't have any {typ} offers.</h2>
            </div>
          ) : (
            <main>
              <Container className={classes.cardGrid} maxWidth="xl">
                <Grid container spacing={4}>
                  {renderCards(subOffer, typ, mode)}
                </Grid>
              </Container>
            </main>
          )}
          <br />
          <br />
        </Col>
      </Row>
    );
  };
  return (
    <>

      <Container>

      <FormGroup column  className={classes.btnGrp}>
      <FormControlLabel
        control={<Switch checked={activeBtn.A} onChange={() => {setActiveBtn({A: !activeBtn.A, B: !activeBtn.B}); setValue(0);}} name="checkedA" />}
        label="Sent Offers"
      />
      <FormControlLabel
        control={
          <Switch
            checked={activeBtn.B}
            onChange={() => {setActiveBtn({A: !activeBtn.A, B: !activeBtn.B}); setValue(0);}}
            name="checkedB"
            color="primary"
          />
        }
        label="Received Offers"
      />
    </FormGroup>
        
        {activeBtn.A ? (
          <OfferTabs
            inTab={renderOfferType}
            sOffers={sentOffers}
            mode="buyer"
            value={value}
            setValue={setValue}
          />
        ) : (
          <OfferTabs
            inTab={renderOfferType}
            sOffers={receivedOffers}
            mode="seller"
            value={value}
            setValue={setValue}
          />
        )}
        
      </Container>

    </>
  );
}

export default OffersPage;
