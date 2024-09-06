import React, { createContext, useState, useEffect } from "react";


export const ShopContext  = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0
    }
    return cart;
}

const ShopContextProvider = (props) => {

    const [all_product, setAll_Product] = useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());

    useEffect(()=>{
       fetch('https://nz-wears-su6a.vercel.app/allproducts')
       .then((response)=>response.json())
       .then((data)=>setAll_Product(data));

       if(localStorage.getItem('auth-token')){
            fetch('https://nz-wears-su6a.vercel.app/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
              .then((data)=>setCartItems(data))
       }
    },[])

    
    const addToCart = (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')){
            fetch('https://nz-wears-su6a.vercel.app/addtocart',{
                method: 'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
        // console.log("Product added to cart:", itemId);
        // console.log(cartItems)  
    }



    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch('https://nz-wears-su6a.vercel.app/removefromcart',{
                method: 'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=> product.id===Number(item))
                totalAmount += itemInfo.new_price * cartItems[item];
            }
            
            
        }
        return totalAmount
        // console.log(getTotalCartAmount)
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem+= cartItems[item]
            }    
        }    
        return totalItem
    }
    // useEffect(() => {
    //     console.log("Cart items updated:", cartItems);
    // }, [cartItems]);

    // useEffect(() => {
    //     console.log("Cart items updated:", getTotalCartAmount());
    // }, [cartItems]);
    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider