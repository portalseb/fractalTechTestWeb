import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import AddEditOrder from './routes/AddEditOrder';
import ListOrders from './routes/ListOrders';


function App() {
  return ( 
    <Routes>
      <Route path='/my-orders' element={<ListOrders/>}/>
      <Route path='/add-order/:id' element={<AddEditOrder/>}/>
      <Route path='/add-order' element={<AddEditOrder/>}/>
   
    </Routes>
  );
}

export default App;
