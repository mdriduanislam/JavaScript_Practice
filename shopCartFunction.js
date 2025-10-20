let products = [
{ id: 1, name: "Smartphone", price: 200, stock: 10 },
{ id: 2, name: "Laptop", price: 800, stock: 5 }
];

let cart = [ ];
let orders = [ ];

function addToCart(productId,quantity){
    let productFound = false;
    for(let i=0;i<products.length;i++){
    if(productId===products[i].id){
        productFound = true;
       if(quantity<=products[i].stock){
        products[i].stock=products[i].stock-quantity;
        const cartObject = {};
        cartObject.id=productId;
        cartObject.quantity=quantity;
        cartObject.price=products[i].price*quantity;
        cart.push(cartObject);
        console.log(`${products[i].name} added to cart. Quantity:${quantity}`);
        return;
       }
       else{
        console.log('Insufficient Product');
        return;
       }
      } 
    }
    if(!productFound){
        throw new Error('Product Not Found');
    }
}
function viewCart(){
    console.log(cart);
}

function placeOrder(){
    let totalPrice=0;
    if(cart.length>0){
        for(i=0;i<cart.length;i++){
            totalPrice=totalPrice+cart[i].price;
        }
        const orderPrice ={Total_Price:totalPrice};
        orders.push(orderPrice);
        console.log('Orders Placed');
        cart.length=0;
    }
    else{
        console.log('Your cart is empty');
        return;
    }
}
try{
    addToCart(1,6);
    viewCart();
    addToCart(2,4);
    viewCart();
    placeOrder();
    console.log(orders);
    viewCart();
}catch(error){
    console.error(error.message);
}