import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import {useNavigate} from "react-router-dom"
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import {Table, TableContainer,TableHead,TableCell, TableBody, TableRow, TextField, Alert} from '@mui/material';
import {Edit, Delete, Message} from '@mui/icons-material';
import Modal from '@mui/material/Modal';

function ListOrders(){
    const navigate = useNavigate()
    const [data,setData]=useState([]);
    const [orderId,setOrderId]=useState("");
    const  [openDelete, setOpenDelete] = React.useState(false);
    const handleOpenDelete = () =>setOpenDelete(true); 
    const handleCloseDelete = () => setOpenDelete(false);
    const peticionGet=async()=>{
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/orders`).then(response=>{
          console.log(response.data)
          setData(response.data);  
        })
    }
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
    const handleDelete=async()=>{
        console.log(orderId)
        const id = {id: orderId}
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/v1/orders/delete/${orderId}`, ).then(response=>{
          alert(`The order with id: ${orderId} was succesfully deleted`)
          peticionGet()
          handleCloseDelete()
        }).catch(error=>{
          alert(`ERROR: ${error.response.data.message}`)
        })  
      }
    useEffect(()=>{
        peticionGet();
   },[])
    function numberProd(orders){
        let i =0;
        orders?.forEach(line => {
            i+=line.qty
            
        });
        return i;
    }
    const selectOrder=(order, caso)=>{
        setOrderId(order);
        (caso==='edit')?navigate(`/add-order/${order}`):handleOpenDelete()
      }
    return(
    <div>
        <h1 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        ListOrders
        </h1>
        <Link to={'/add-order'}>
            <Button >Add Order</Button>
        </Link>
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>#Products</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {data.map(order=>(
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{numberProd(order.products)}</TableCell>
                <TableCell>{order.finalPrice}</TableCell>
                <TableCell>
                  <Edit onClick={()=>selectOrder(order.id,'edit')}/>
                  &nbsp; &nbsp; &nbsp;
                  <Delete onClick={()=>selectOrder(order.id,'delete')}/>
                </TableCell>
                </TableRow>
                ))}
          </TableBody>
          </Table>
          </TableContainer>
          <Modal
        open={openDelete}
        onClose={handleCloseDelete}>
        <Box sx={style}>
        <Button onClick={()=>handleDelete()} >Confirm Deletion</Button>
        <Button onClick={()=>handleCloseDelete()}>Cancel</Button>
        </Box>
      </Modal>
        {/* <Link to={'/add-order/test'}>
            <Button>Presioname</Button>
        </Link> */}
    </div>
    )
}
export default ListOrders
