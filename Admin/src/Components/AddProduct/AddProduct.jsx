import React,{useState} from 'react'
import './AddProduct.css'
import upload_area from '../../Admin_Assets/upload_area.svg'
const AddProduct = () => {

  const [image,setImage] = useState(null);
  const [productDetails,setProductDetails] = useState({
    name: "",
    image: '',
    category: "select",
    new_price: "",
    old_price: ""
  })

  const imageHandler = (e) => {
    // console.log(e.target.files[0]);
      setImage(e.target.files[0]);
  }

  const changeHandler = (e) => {
    setProductDetails({...productDetails,[e.target.name]:e.target.value})
  }

  const Add_Product = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }
    // console.log(productDetails);
    let responseData;
    let product = {...productDetails};

    let formData =  new FormData();
    formData.append('product', image)
    

    await fetch('https://nz-wears-su6a.vercel.app/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body:formData,
    }).then((resp) => resp.json()).then((data)=>{
      responseData=data
    });

    if(responseData.success)
    {
      const imageUrl = `${responseData.image_url}`;
       product.image = imageUrl;
       console.log(product);
       await fetch('https://nz-wears-su6a.vercel.app/addproduct',{
           method:'POST',
           headers:{
              Accept:'application/json',
              'Content-Type':'application/json',
           },
           body:JSON.stringify(product),
       }).then((resp)=>resp.json()).then((data)=>{
          data.success?alert("Product Added"):alert("Failed")
       })
    } 
  
  }
  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here'/>
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here'/>
        </div> 
      </div>
      <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
            <option value="select">Select</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' />
          </label>
          <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
        </div>
        <button onClick={() => {Add_Product()}} className="addproduct-btn">ADD</button>
    </div>
  )
}

export default AddProduct
