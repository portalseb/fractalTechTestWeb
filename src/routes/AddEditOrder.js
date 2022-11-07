import React from "react";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import TextField from "@mui/material/TextField"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal'
import axios from 'axios';
import {Table, TableContainer,TableHead,TableCell, TableBody, TableRow,  Alert} from '@mui/material';
import Button  from "@mui/material/Button"
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {Edit, Delete, Message} from '@mui/icons-material';

function AddEditOrder(){
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => { productosGet()
        setOpen(true)
    };
    const handleClose = () => setOpen(false);
    const [data,setData]=useState([]);
    const [orderId,setOrderId]=useState("");
    const [orderNo,setOrderNo]=useState("");
    const [finalPrice,setFinalPrice]=useState(0.0);
    const [date,setDate]=useState(today.toDateString());
    const [noProducts,setNoProducts]=useState(0);
    const [productsArr,setProductsArr]=useState([]);
    const [qty, setQty]=useState(0);
    const {id} = useParams()
    const [product, setProduct] = React.useState('');
    const [products,setProducts]=useState([]);

    useEffect(() => {
      if(data?.products)
      setProductsArr(data.products)
      setQty(numberProd(data.products))
    
      
    }, [data])
    useEffect(() => {
        setQty(numberProd(productsArr))
  
      }, [productsArr])
    
    

  const handleChange = (event) => {
    setProduct(event.target.value);
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
    const peticionGet=async()=>{
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/orders/${id}`).then(response=>{
          console.log(response.data)
          setData(response.data); 
          setOrderNo(response.data.orderNo) 
          setDate(response.data.date)
          setNoProducts(response.data.products.length)
        })
    }
    const productosGet=async()=>{
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/products`).then(response=>{
          console.log(response.data)
          setProducts(response.data)
        })
    }
    const handleAdd=()=>{
        let currProd = {product, qty: noProducts, totalPrice: product.unitPrice*noProducts}
        setProductsArr(products=>[...products,currProd])
        setOpen(false)
    }
    const handleSubmit=async()=>{
        const formData={
          id,
          orderNo,
          date: new Date(date),
          products: productsArr,
          finalPrice: calcPrice(productsArr)
        }
        console.log(formData)
        await axios.post(`${process.env.REACT_APP_BASE_URL}/v1/orders/insert`,formData).then(response=>{
          if(!response){
            return
          }
          alert(`Order with id: ${response.data.id} was succesfully created`)
          peticionGet()
          handleClose() 
        }).catch(error=>{
          alert(`ERROR: ${error.response.data.message}`)
        })
      }



    useEffect(()=>{
        if(!id){
            console.log("Sin llamada")
            return
        }
        // llamada
        peticionGet()
     
    },[id])
    function numberProd(orders){
        let i =0;
        console.log(orders)
        orders?.forEach(line => {
            i+=line.qty
            
        });
        return i;
    }
    function calcPrice(orders){
        let i=0;
        console.log(orders)
        orders?.forEach(line=>{
            i+=line.totalPrice
        });
        return i
    }

    return(
        
        <div>
            <div>
            <h1 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            {!!id?`Edit Order `:"Add Order"}

            </h1>
           <Box >
                <TextField
                id="outlined-orderNo"
                label="Order No"
                value={orderNo}
                onChange={(e)=>setOrderNo(e.target.value)}
                />
                <TextField
                disabled
                id="outlined-Date"
                label="Date"
                value={date}
                />
                <TextField
                disabled
                id="outlined-ProductsNo"
                label="Number of Products"
                value={qty}
                />
            </Box>
        </div>
        <div>
                <Button onClick={handleOpen}>
                 Add Product to order
                </Button>

        </div>
        <div>
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {productsArr?.map(productq=>(
              <TableRow key={productq.product.id}>
                <TableCell>{productq.product.id}</TableCell>
                <TableCell>{productq.product.name}</TableCell>
                <TableCell>{productq.product.unitPrice}</TableCell>
                <TableCell>{productq.qty}</TableCell>
                <TableCell>{productq.product.unitPrice*productq.qty}</TableCell>
                <TableCell>
                  <Edit onClick={()=>console.log("")}/>
                  &nbsp; &nbsp; &nbsp;
                  <Delete onClick={()=>console.log("")}/>
                </TableCell>
                </TableRow>
                ))}
          </TableBody>
          </Table>
          </TableContainer>
        </div>
        <Button onClick={handleSubmit}> Save</Button>
        <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
        <Select
          labelId="Products:"
          id="selectProduct"
          value={product}
          label="Select a product"
          onChange={handleChange}>
         {products.map((name) => (
            <MenuItem key={name.name} value={name}>
              {name.name} 
              </MenuItem> 
              ))} 
        </Select>
        <br/>
        <br/>
        <TextField
                id="outlined-qty"
                label="Qty"
                value={noProducts}
                onChange={(e)=>setNoProducts(e.target.value)}
                />
        <br/>
        <br/>
        <Button onClick={handleAdd}>Confirm </Button>
        </Box>
        
      </Modal>
        </div>
    )
}
export default AddEditOrder