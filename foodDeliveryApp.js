const restaurants = [
{ id: 1, name: "Pizza Place", menu: [{ name: "Pepperoni Pizza", price: 12 }] },
{ id: 2, name: "Sushi House", menu: [{ name: "Salmon Sushi", price: 15 }] }
];
const orders = [ ];
const reviews = [ ];
// Discount in percentage
const discountCodes = { "SAVE10": 10, "WELCOME15": 15 };


function getfoodPrice(name,itemName){
    let restaurantFound = false;
       for(let i=0;i<restaurants.length;i++){
           if(name===restaurants[i].name){
               restaurantFound = true;
                for(let j=0;j<restaurants[i].menu.length;j++){
                    if(itemName===restaurants[i].menu[j].name){
                        return restaurants[i].menu[j].price;
                    }
                }
               return 'Item not found';
           }
       }
       if(!restaurantFound){
           return 'Restaurant not found';
       }
}

function placeOrder(customer, restaurantName, itemName, discountCode) {
  const price = getfoodPrice(restaurantName, itemName);

  if (typeof price !== "number") {
    throw new Error(price);
  }

  const order = {
    id: orders.length + 1,
    customer,
    restaurant: restaurantName,
    item: itemName,
    status: "pending",
  };

  if (discountCode) {
    if (discountCodes[discountCode]) {
      const discountPercent = discountCodes[discountCode];
      order.price = price - (price * discountPercent) / 100;
    } else {
      throw new Error("Invalid discount code");
    }
  } else {
    order.price = price;
  }

  orders.push(order);
  console.log("✅ Order placed:", order);
  return `Order placed successfully. Order ID: ${order.id}`;
}

function totalSalesByRestaurant(restaurantName) {
    const totalOrder = orders.filter(order => order.restaurant === restaurantName);
    const totalSales = totalOrder.reduce((sum, order) => sum + order.price, 0);
    return totalSales;
}

function submitReview(orderId, restaurantName, rating, comment) {
    const order = orders.find(o => o.id === orderId && o.restaurant === restaurantName);
    if (!order) {
        throw new Error("Order not found for the given restaurant");
    }
    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }
    if(comment.length < 20) {
        throw new Error("Comment must be at least 20 characters long");
    }

    const review = {
        orderId,
        restaurantName,
        rating,
        comment
    };
    reviews.push(review);
    console.log('Review submitted successfully');
}

try {
  console.log(placeOrder("Alice", "Pizza Place", "Pepperoni Pizza", "SAVE10"));
  console.log(placeOrder("Bob", "Sushi House", "Salmon Sushi", "WELCOME15"));
  console.log(placeOrder("Bob", "Sushi House", "Salmon Sushi", "SAVE10"));
  console.log(orders);
  console.log("Total Sales at Pizza Place:", totalSalesByRestaurant("Pizza Place"));
  console.log("Total Sales at Sushi House:", totalSalesByRestaurant("Sushi House")); 
  console.log(submitReview(1, "Pizza Place", 5, "The pizza was absolutely delicious and the service was excellent!"));
  console.log(submitReview(2, "Sushi House", 4, "Great sushi but a bit pricey."));
  console.log(reviews);
  console.log(submitReview(1, "Pizza Place", 6, "The pizza was absolutely amazing! Will order again."));
  console.log(submitReview(3, "Sushi House", 4, "Fresh and tasty sushi, though delivery was a bit late."));
  console.log(placeOrder("Charlie", "Pizza Place", "Pepperoni Pizza")); 
  console.log(placeOrder("David", "Pizza Place", "Veggie Pizza")); 
  console.log(orders);
} catch (error) {
  console.error("❌ Error:", error.message);
}

console.log(getfoodPrice("Pizza Place", "Pepperoni Pizza")); // 12
console.log(getfoodPrice("Sushi House", "Salmon Sushi")); // 15
console.log(getfoodPrice("Pizza Place", "Burger")); // Item not found
console.log(getfoodPrice("Burger Shop", "Cheeseburger")); // Restaurant not found