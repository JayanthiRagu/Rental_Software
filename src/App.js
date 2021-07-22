import React, { Component } from 'react';
import axios from 'axios';
import data from './data.json';
import './App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

class App extends Component {
  constructor(){
    super();
    this.state={
      book:false,
      return:false,
      startDate:new Date(),
      from:new Date(),
      to:new Date(),
      show_price:false,
      totalPrice:0,
      selectedValue:data[0].name,
      mileage:null,
      searchValue:''
    }
  }

  book=()=>{
    this.setState({book:true,return:false});
  }

  return=()=>{
    this.setState({book:false,return:true});
  }

  onFromDate=(e)=>{
    this.setState({
      from:moment(e).toDate()
  }); 
  }

  onToDate=(e)=>{
    this.setState({
      to:moment(e).toDate()
  }); 
  }

  CancelBooking=()=> {
    this.setState({
      book:false,return:false
    })
  }

  onDropdown=(e)=>{
    this.setState({selectedValue:e.target.value});
  }

  ProceedBooking=()=>{
    var num_of_days=Math.ceil((this.state.to-this.state.from)/8.64e7);
    var price,minimum_rent_period,type,durability;
    data.map((data,index)=>{
      if(data.name==this.state.selectedValue){
        price=data.price;
        minimum_rent_period=data.minimum_rent_period;
        type=data.type;
        durability=data.durability;
      }
    })

    //Durability
    if(type.includes("p"))
    {
      durability=durability-1;
    }
    else if(type.includes("m")){
      durability=durability-2;
    }
    durability=(durability-2)*num_of_days;

    //Price Calculation for rental including meter estimation
    this.setState({totalPrice:(num_of_days*10*price*minimum_rent_period),show_price:true,book:false});
  }

  ConfirmBooking=()=>{
    this.setState({
      book:false,return:false,show_price:false
    })
  }

  onMileageChange=(e)=>{
    this.setState({mileage:e.target.value});
  }

  ProceedReturn=()=>{
    var price,minimum_rent_period;
    data.map((data,index)=>{
      if(data.name==this.state.selectedValue){
        price=data.price;
        minimum_rent_period=data.minimum_rent_period;
      }
    })
    this.setState({totalPrice:(price*minimum_rent_period),show_price:true,return:false});
  }
  search=(e)=>{
    this.setState({searchValue:e.target.value})
  }

  render() {
    return (
      <div class="container">
        <div class="search">
          Search:<input type="text" value={this.state.searchValue} onChange={this.search}></input>
        </div>
        {this.state.book &&<div class="book">Book a Product
              <select id="dropdown" onChange={this.onDropdown}>
              {data.map((data,index)=>(
                <React.Fragment key={index}>
                <option value={data.name}>{data.name}</option>
                </React.Fragment>
              ))}
              </select>
              From:<DatePicker datefromat="MM/dd/yyyy" selected={this.state.from} onChange={this.onFromDate} /><br></br>
              To:<DatePicker datefromat="MM/dd/yyyy" selected={this.state.to} onChange={this.onToDate} /><br></br>
              <button type="submit" onClick={this.ProceedBooking}>Proceed</button>
              <button type="submit" onClick={this.CancelBooking}>Cancel</button>
            </div>}

            {this.state.return &&<div class="book">Return a Product
              <select id="dropdown" onChange={this.onDropdown}>
              {data.map((data,index)=>(
                <React.Fragment key={index}>
                <option value={data.name}>{data.name}</option>
                </React.Fragment>
              ))}
              </select>
              Mileage:<input type="text" onChange={this.onMileageChange}></input>
              <button type="submit" onClick={this.ProceedReturn}>Proceed</button>
              <button type="submit" onClick={this.CancelBooking}>Cancel</button>
            </div>}

          {this.state.show_price && <div class="book">
            Your total price is {this.state.totalPrice}<br></br><br></br>
            Do you want to proceed?<br></br><br></br>
            <button type="submit" onClick={this.ConfirmBooking}>Confirm</button>
          </div>}

        <table>
          <tr>
            <td>Id</td>
            <td>Name</td>
            <td>Code</td>
            <td>Availability</td>
            <td>Need to Repair</td>
            <td>Durability</td>
            <td>Milegae</td>
          </tr>
          {data.filter((item)=>{
            if(item.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||item.name.toUpperCase().includes(this.state.searchValue.toUpperCase())||item.code.toLowerCase().includes(this.state.searchValue.toLowerCase())||item.code.toUpperCase().includes(this.state.searchValue.toUpperCase())||item.durability==this.state.searchValue||item.max_durability==this.state.searchValue||item.mileage==this.state.searchValue)
              return true
            else 
              return false}).map((data,index)=>(
            <tr key={index}>
              <td>{index+1}</td>
              <td>{data.name}</td>
              <td>{data.code}</td>
              <td>{data.availability}</td>
              <td>{data.needing_repair}</td>
              <td>{data.durability}/{data.max_durability}</td>
              <td>{data.mileage}</td>
            </tr>
          )
          )
          }
        </table>
          <div class="button-div">
            <button type="submit" onClick={this.book}>Book</button>
            <button type="submit" onClick={this.return}>Return</button>
          </div>
      </div>
    );
  }
}

export default App;