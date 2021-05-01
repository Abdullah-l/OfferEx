// Shows a seller's current listings and offer actions

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Icon, Col, Row } from "antd";
import RatingPrompt from "./Sections/RatingPrompt";
import { ratingCalc, labels } from "../../utils/RatingCalc";


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
import Rating from "@material-ui/lab/Rating";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Box } from "@material-ui/core";

const { Meta } = Card;

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
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
    float: "left",
  },
  rejectBtn: {
    float: "right",
  },
  btnGrp: {
    display: "flex",
    justifyContent: "center",
    boxShadow: "none",
  },
}));

function MyListingsPage(props) {
  const classes = useStyles();
  const [Products, setProducts] = useState([]);

  const [open, setOpen] = useState({});
  const [showRating, setShowRating] = useState({ active: false });

  const [pageRefresh, setPageRefresh] = useState('');


  useEffect(() => {
    const variables = {
      userId: "",
    };
    if (props.user.userData) {
      variables.userId = props.user.userData._id;
      getProducts(variables);
    }
  }, [props.user, pageRefresh]);

  const getProducts = (variables) => {
    Axios.get("/api/product/getMyListings", { params: variables }).then(
      (response) => {
        if (response.status === 200) {
          getOffers(response.data.products);
        } else {
          alert("Failed to fetch your listings data");
        }
      }
    );
  };
  const getOffers = (products) => {
    const variables = {
      userId: props.user.userData._id,
      status: 0,
    };
    Axios.get("/api/offer/getSellerOffers", { params: variables }).then(
      (response) => {
        if (response.status === 200) {
          const p = filterOffers(products, response.data.offers);
          setProducts(p);
        } else {
          alert("Failed to fetch offers data");
        }
      }
    );
  };

  const filterOffers = (prods = [], offers = []) => {
    prods.forEach((prod, idx) => {
      prod.prodOffers = [];
      let i = 0;
      while (i < offers.length) {
        if (offers[i].product == prod._id) {
          prod.prodOffers.push(offers[i]);
        }
        i++;
      }
    });
    return prods;
  };

  const onOfferAction = (offerId, type) => {
    setShowRating({ ...showRating, [offerId]: true, active: true, type: type });
  };


  const renderOffers = (offers, prodIdx) =>
    offers.map((offer, index) => {
      return (
        <>
          {showRating[offer._id] ? (
            <RatingPrompt
              offer={offer}
              offerClose={offerClose}
              prodIdx={prodIdx}
              refreshPage={refreshPage}
              type={showRating.type}
            />
          ) : showRating.active ? null : (
            <div item key={index}>
            <Typography>Buyer: {offer.buyer.name}  </Typography>
            <Box display='flex'>
              <Typography style={{display: 'flex', alignItems: 'end'}} >Rating:  </Typography>

              {offer.buyer.rating && (
                <Box ml={1} mb={1} display='flex' >
                <Rating style={{marginTop: '3px'}} readOnly value={ratingCalc(offer.buyer.rating)} size='small' />
                <Box >{`(${offer.buyer.rating.length})`}</Box>
                </Box>
              )}
              </Box>

              <Typography>{`Offer: $${offer.price}`}</Typography>

              {offer.message && <Typography>Message: {offer.message}</Typography>}
              <br />
              <ButtonGroup className={classes.btnGrp} variant="contained">
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.acceptBtn}
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={() => onOfferAction(offer._id, 'accept')}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.rejectBtn}
                  startIcon={<NotInterestedIcon />}
                  onClick={() => onOfferAction(offer._id, 'reject')}
                >
                  Reject
                </Button>
              </ButtonGroup>
              <br />
              <hr />
            </div>
          )}
        </>
      );
    });

  const offerClickOpen = (index) => {
    setOpen({ ...open, [index]: true });
  };

  const offerClose = (index) => {
    setOpen({ ...open, [index]: false });
    setShowRating({ active: false });

  };
  const refreshPage = (anyString) => {
    setPageRefresh(anyString);
  };

  const renderCards = (products) =>
    products.map((product, index) => {
      console.log(product);
      let img = "https://source.unsplash.com/random";
      if (product.images[0]) {
        img = "http://localhost:5000/uploads/" + product.images[0].slice(8);
      }
      return (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={3}>
          <Card className={classes.card}>
            <a href={`/listing/${product._id}`}>
              <CardMedia className={classes.cardMedia} image={img} />
            </a>

            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h6" component="h2" noWrap>
                {product.title}
              </Typography>
              <Typography>{`Price: $${product.price}`}</Typography>
              <Typography>{`Status: ${product.sold === 0 ? 'Available' : 'Sold'}`}</Typography>
              <br />
              {product.prodOffers.length === 0 ? (
                <Typography>{product.sold === 0 && 'No Offers Yet'}</Typography>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size='small'
                    onClick={() => offerClickOpen(index)}
                  >
                  {product.prodOffers.length === 1 ?  `See ${product.prodOffers.length} current offer` :
                  `See ${product.prodOffers.length} current offers`
                  }
                  </Button>
                  <Dialog
                    open={open[index] ? open[index] : false}
                    onClose={() => offerClose(index)}
                    aria-labelledby={index + " title"}
                    aria-describedby={index + " description"}
                    fullWidth
                    maxWidth='xs'
                  >
                    <DialogTitle id={index + " title"}>
                      {showRating.active ? "One last step..." : "Current Offers"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText
                        component={"div"}
                        id={index + " description"}
                      >
                        {renderOffers(product.prodOffers, index)}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    {showRating.active &&
                      <Button onClick={() => { setShowRating({ active: false })}} color="primary">
                        Back
                      </Button>}
                      <Button onClick={() => offerClose(index)} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      );
    });

  const renderOfferType = (products) => {
    console.log(products);
    return (
      <Row gutter={[32, 32]}>
      
        <Col lg={16} style={{margin: 'auto', float : 'unset'}}>

          {products.length === 0 ? (
            <div
              style={{
                display: "flex",
                height: "300px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>You don't have any listings.</h2>
            </div>
          ) : (
            <main>
              <Container className={classes.cardGrid} maxWidth="xl">
                <Grid container spacing={4}>
                  {renderCards(products)}
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

        {renderOfferType(Products)}

    </>
  );

}

export default MyListingsPage;
