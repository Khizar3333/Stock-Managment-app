'use client'
import Header from '@/components/Header'
import Image from 'next/image'
import {useState,useEffect} from 'react'
export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setDropdown] = useState([])
useEffect(() => {
  const fetchproducts=async()=>{

    const response = await fetch('/api/products') 
    let rjson=await response.json()
    setProducts(rjson.products)
  }
   fetchproducts()
}, [])


  const addProduct=async(e)=>{
  
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productForm)
        });
  
        if (response.ok) {
          console.log('Product added successfully!');
          setAlert("Your product has been added")
          setProductForm({})
        } else {
          console.log('Failed to add product');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    // fetch all the products to sync back

      const response = await fetch('/api/products') 
    let rjson=await response.json()
    setProducts(rjson.products)
    e.preventDefault();

    };

    // immediately change the quantity of the product with the given slug in products and dropdown
    const buttonaction=async(action,slug,initialquantity) => {
      let index=products.findIndex((item)=>item.slug==slug)
      let newproducts=JSON.parse(JSON.stringify(products))
      if(action=="plus"){
        newproducts[index].quantity=parseInt(initialquantity)+1
      }
      else{
        newproducts[index].quantity=parseInt(initialquantity)-1
        
      }
      setProducts(newproducts)
      console.log(action,slug)

      let indexdrop=dropdown.findIndex((item)=>item.slug==slug)
      let newdropdown=JSON.parse(JSON.stringify(dropdown))
      if(action=="plus"){
        newdropdown[indexdrop].quantity=parseInt(initialquantity)+1
      }
      else{
        newdropdown[indexdrop].quantity=parseInt(initialquantity)-1
        
      }
      setDropdown(newdropdown)
      console.log(action,slug)

      setLoadingaction(true)
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action,slug,initialquantity})
      });
      let r=await response.json()
      console.log(r)
      setLoadingaction(false)
    }
    
  
    
  const handleChange=(e)=>{
    setProductForm({...productForm,[e.target.name]: e.target.value})
  }
  const dropdownedit=async(e) => {
    let value=e.target.value
    setQuery(value)
    if(value.length>3){
      setLoading(true)
      setDropdown([])
      const response = await fetch('/api/search?query='+ query) 
      let rjson=await response.json()
      setDropdown(rjson.products)
      setLoading(false)

    }
    else{
      setDropdown([])
    }
  }


  
  return (
    <>
      <Header />
      <div className="my-3 container mx-auto">
      <div className="text-green-800 text-center">{alert}</div>
      <h1 className="text-3xl font-semibold mb-2">Search a product</h1>
        <div className="flex justify-between mb-2">
          <input
          // onBlur={()=>{setDropdown([])}} 
          onChange={dropdownedit}
            type="text"
            placeholder="Search..."
            className=" px-4 py-2 border border-gray-300 rounded w-full"
          />
          <select className="px-4 py-2 border border-gray-300 rounded">
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="outofstock">Out of stock</option>
          </select>
        </div>
  
{loading && <div className="flex  justify-center">
  
<svg xmlns="http://www.w3.org/2000/svg" width="90px" height="70px" viewBox="0 0 50 50">
  <circle cx="25" cy="25" r="20" fill="none" stroke="#000" strokeWidth="4">
    <animate attributeName="r" from="10" to="20" dur="0.8s" repeatCount="indefinite" />
    <animate attributeName="opacity" from="1" to="0" dur="0.8s" repeatCount="indefinite" />
  </circle>
</svg>


</div>}
<div className="dropdown absolute w-[85vw]  bg-purple-100 rounded-md">
          {dropdown.map(item=>{
            return(
            <div key={item.slug} className=" p-2 my-3 container flex justify-between border-b-2">
            <span className="slug">{item.slug} ({item.quantity} available for Rs {item.price})</span>  
               <div className="mx-5">
              <button disabled={loadingaction} onClick={()=>{buttonaction("minus",item.slug,item.quantity)}} className="add inline-block text-white font-semibold disabled:bg-purple-200 cursor-pointer shadow-md bg-purple-400 rounded-lg px-3 py-2">-</button>
              <span  className="quantity mx-3">{item.quantity}</span>
              <button disabled={loadingaction} onClick={()=>{buttonaction("plus",item.slug,item.quantity)}} className="subtract inline-block disabled:bg-purple-200 text-white font-semibold cursor-pointer shadow-md bg-purple-400 rounded-lg px-3 py-2">+</button>
              </div>
            </div>
          )})}
        </div>
        </div>
      {/* display current stock */}
      <div className="my-3 container mx-auto">

        <h1 className="text-3xl font-semibold mb-4">Add a product</h1>
        <p className="text-lg text-gray-800">Enter the details of the product below:</p>
        <div className="flex flex-col justify-between mb-4 bg-white">
          <form action="">
          <div className='mb-4'>
            <label className="block mt-3" htmlFor="slug">Product slug</label>
          <input onChange={handleChange}
          id='slug'
          value={productForm?.slug || ""}
          name='slug'
            type="text"
            placeholder="Product name"
            className="w-full px-4 py-2 border-2 border-black-400 rounded mt-3"
          />
          </div>
          <div className='mb-4'>
            <label className="block mt-3" htmlFor="quantity">Quantity</label>
          <input onChange={handleChange}
          name='quantity'
          value={productForm?.quantity || ""}
          id='quantity'
            type="number"
            placeholder="quantity"
            className="w-full px-4 py-2 border-2 border-black-400 rounded mt-3"
          />
          </div>
          
          <div className='mb-4'>
            <label className="block mt-3" htmlFor="quantity">price</label>
          <input onChange={handleChange}
          name='price'
          value={productForm?.price || ""}
          id='price'
            type="number"
            placeholder="quantity"
            className="w-full px-4 py-2 border-2 border-black-400 rounded mt-3 "
          />
          </div>
          <button onClick={addProduct} className="mx-2 my-6 px-6 py-2 bg-purple-500 hover:bg-blue-600 text-white rounded-md ">Add a Product</button>
          </form>
          </div>
          
        </div>
      <div className="mt-6 container  mx-auto">

        <h1 className="text-3xl font-bold mb-4">Display Current stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product=>{
             return <tr key={product.slug}>
              <td className="border px-4 py-2">{product.slug}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">Rs{product.price}</td>
            </tr>
            })}
            
             
            {/* Add more rows for each product */}
          </tbody>
        </table>
        
      </div>
    </>
  );
  };
