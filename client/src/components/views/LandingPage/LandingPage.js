// This is the home page that shows listings as cards with filtration options


import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Icon, Col, Row, Button } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { catagories, price } from '../../Datas';
import SearchFeature from './Sections/SearchFeature';
import { useSelector } from "react-redux";



import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { propTypes } from 'react-time-ago';

const { Meta } = Card;

const useStyles = makeStyles((theme) => ({

    cardGrid: {
      paddingBottom: theme.spacing(8),
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
  
  }));

function LandingPage() {

    const classes = useStyles();

    const user = useSelector(state => state.user);

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()
    const [SearchTerms, setSearchTerms] = useState("")

    const [Filters, setFilters] = useState({
        catagories: [],
        price: []
    })

    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit,
        }

        getProducts(variables)

    }, [])

    const getProducts = (variables) => {
        Axios.post('/api/product/getProducts', variables)
            .then(response => {
                if (response.data.success) {
                    if (variables.loadMore) {
                        setProducts([...Products, ...response.data.products])
                    } else {
                        setProducts(response.data.products)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('Failed to fetch items')
                }
            })
    }

    const onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters,
            searchTerm: SearchTerms
        }
        getProducts(variables)
        setSkip(skip)
    }


    const renderCards = Products.map((product, index) => {
        // fallback if no img is provided
        // won't happen though, implemented img check
        let img = "https://source.unsplash.com/random";
        if (product.images[0]){
            img = "http://localhost:5000/uploads/" + product.images[0].slice(8);
        }
        console.log(product.images[0]);
        return( <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Card className={classes.card}>
                      <a href={`/listing/${product._id}`}>
      
                        <CardMedia
                          className={classes.cardMedia}
                          image={img}
                        />
                           </a>
      
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h6" component="h2" noWrap>
                          {product.title}
                          </Typography>
                          <Typography>
                          {`$${product.price}`}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
        )
    })


    const showFilteredResults = (filters) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters

        }
        getProducts(variables)
        setSkip(0)

    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {

            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        console.log('array', array)
        return array
    }

    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        newFilters[category] = filters

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues

        }

        console.log(newFilters)

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerms = (newSearchTerm) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)
    }


    return (
        <>
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
            {(user.userData && user.userData.isAuth) ? <h2>Welcome Back, {user.userData.name}! <Icon type="smile" /></h2>:
                <h2>  Welcome to OfferEx!  <Icon type="smile" />  </h2>
            }
            </div>
            </div>


            {/* Filter  */}

            <Row gutter={[16, 16]}>
                <Col lg={4} offset={1}>
                    <CheckBox
                        list={catagories}
                        handleFilters={filters => handleFilters(filters, "catagories")}
                    />
                </Col>
                <Col lg={18}>
                    <RadioBox
                        list={price}
                        handleFilters={filters => handleFilters(filters, "price")}
                    />

            {/* Search  */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem auto' }}>

                <SearchFeature
                    refreshFunction={updateSearchTerms}
                />

            </div>


            {Products.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>Sorry, no listings yet...</h2>
                </div> :
            <main>
              <Container className={classes.cardGrid} maxWidth="xl">
                <Grid container spacing={4}>
                {renderCards}

                </Grid>
                </Container>
                </main>
            }

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={onLoadMore} type="primary" shape="round" size={'large'}>
                Load More
                </Button>
                </div>
            }
            </Col>

            </Row>
            <br /><br />

</>
    )
}

export default LandingPage
