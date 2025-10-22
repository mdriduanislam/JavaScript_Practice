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



const userDatabase = (function () {
const users = [ ];
const transactions = [];
let processingFee = 0;

return {

registerUser: function (name, pin) {
    if(!name || !pin){
        throw new Error('Name and PIN are required');
    }
    if(typeof pin !== 'number' || pin.toString().length !==4){
        throw new Error('PIN must be a 4-digit number');
    }
    const newUser = {
        id: users.length + 1,
        name,
        pin,  
        balance: 0
    }; 
    users.push(newUser); 
    console.log(`✅ User '${name}' registered successfully!`);
    return true;
},

loginUser: function (name, pin) {
  const user = users.find(u => u.name === name && u.pin === pin);
  if (!user) {
    console.log("❌ Invalid username or PIN");
    return null;
  }
  console.log(`✅ User '${name}' logged in successfully!`);
  return user;
},

addMoney: function (name,pin, amount) {
    const user = this.loginUser(name,pin);
    if(user){
      user.balance += amount;
      console.log(`✅ Added $${amount} to '${name}' account. New balance: $${user.balance}`);
    }
    if(!user){
      console.log('❌ Unable to add money. Your money is refunded.')   
    }
},

checkBalance: function (name,pin) {
    const user = this.loginUser(name,pin);
    if(!user){
      console.log('❌ Unable to check balance. Please login again.');
      return;
    }
    console.log(`'${name}' balance: $${user.balance}`);
    return user.balance;
},

sendMoney: function (fromName, fromPin, toName, amount) {
  const sender = this.loginUser(fromName, fromPin);
  if (!sender) {
    throw new Error('You don\'t have permission to send money');
  }
  const fee = 15;
  if (sender.balance < amount + fee) {
    throw new Error('Insufficient balance to send money');
  }
  const receiver = users.find(u => u.name === toName);
  if (!receiver) {
    throw new Error('Recipient not found');
  }
  sender.balance -= (amount + fee);
  receiver.balance += amount;
  processingFee = processingFee + fee;
  console.log(`✅ Transferred $${amount} from '${fromName}' to '${toName}'`);
  const history = {
    sender: fromName,
    receiver: toName,
    amount: amount,
    fee,
  }
  transactions.push(history);
  console.log(`✅ Transaction recorded: $${amount} from '${fromName}' to '${toName}'`);
  return history;
},

transactionsHistory: function (name,pin, fromName, fromPin, toName, amount) {
   if(transactions.length===0){
    console.log('No transactions found');
    return [];
   }
   console.log('Transaction History:');
   transactions.forEach((tx, index) => {
    console.log(`${index + 1}. From: ${tx.sender}, To: ${tx.receiver}, Amount: $${tx.amount}`);
   });
   return [...transactions];
},

getProcessingFees() {
      return processingFee;
  },

getAllUsers: function () {
      return [...users];
    }
}
} )();

try {
  userDatabase.registerUser("Alice", 1234);
  userDatabase.registerUser("Bob", 5678);
  userDatabase.addMoney("Alice", 1234, 500);
  userDatabase.checkBalance("Alice", 1234);
  userDatabase.checkBalance("Bob", 5678);
  userDatabase.sendMoney("Alice", 1234, "Bob", 150);
  userDatabase.checkBalance("Alice", 1234);
  userDatabase.checkBalance("Bob", 5678);
  userDatabase.transactionsHistory();
  userDatabase.sendMoney("Alice", 1234, "Bob", 150);
  userDatabase.checkBalance("Alice", 1234);
  userDatabase.checkBalance("Bob", 5678);
  userDatabase.transactionsHistory();
  console.log(userDatabase.getAllUsers());
  console.log(userDatabase.getProcessingFees());
} catch (error) {
  console.error("❌ " + error.message);
}


// Todo.js

class TodoApp {
  constructor() {
    // stores tasks
    this.todos = [];
  }

  /**
   * addTodo(name, timeNeeded, category)
   * - name: string (task name)
   * - timeNeeded: number (time in whatever unit you prefer)
   * - category: string (Study, Entertainment, Personal, Health, Learning, etc.)
   *
   * Task object structure:
   * { id, name, category, time, completed, createdAt }
   */
  addTodo(name, timeNeeded, category) {
    if (!name || name.toString().trim() === "") {
      console.log("❌ Task name is required.");
      return false;
    }
    const time = Number(timeNeeded);
    if (Number.isNaN(time) || time < 0) {
      console.log("❌ Invalid time value.");
      return false;
    }

    const newTask = {
      id: this.todos.length + 1,
      name: name.toString().trim(),
      category: category ? category.toString().trim() : "Uncategorized",
      time: time,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.todos.push(newTask);
    console.log(`✅ Added task: "${newTask.name}" (ID: ${newTask.id})`);
    return newTask;
  }

  /**
   * completeTodo(taskName)
   * - finds task by name (first match)
   * - if found, sets completed = true and returns true
   * - else returns false
   */
  completeTodo(taskName) {
    if (!taskName) return false;
    const task = this.todos.find((t) => t.name === taskName);
    if (!task) return false;
    if (task.completed) {
      // already completed
      return true;
    }
    task.completed = true;
    return true;
  }

  /**
   * removeTodo(taskName)
   * - finds task index by name and removes it from todos
   * - returns removed task or null if not found
   */
  removeTodo(taskName) {
    const index = this.todos.findIndex((t) => t.name === taskName);
    if (index === -1) {
      console.log(`❌ Task "${taskName}" not found.`);
      return null;
    }
    const [removed] = this.todos.splice(index, 1);
    console.log(`🗑️ Removed task: "${removed.name}" (ID: ${removed.id})`);
    return removed;
  }

  /**
   * displayTodoList(category?)
   * - if no category passed: log all tasks (id, name, category, time, completed)
   * - if category passed: log only tasks in that category
   */
  displayTodoList(category) {
    const list =
      typeof category === "undefined"
        ? this.todos
        : this.todos.filter((t) => t.category === category);

    if (list.length === 0) {
      if (typeof category === "undefined") {
        console.log("📭 No tasks available.");
      } else {
        console.log(`ℹ️ No tasks found in category "${category}".`);
      }
      return;
    }

    console.log("\n📝 Todo List:");
    list.forEach((t) => {
      console.log(
        `ID: ${t.id} | ${t.name} | Category: ${t.category} | Time: ${t.time} | Completed: ${t.completed}`
      );
    });
    console.log("");
  }

  /**
   * hoursWorked()
   * - total time for completed tasks
   * - implemented with reduce
   */
  hoursWorked() {
    return this.todos
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + Number(t.time || 0), 0);
  }

  /**
   * timeNeeded()
   * - total time for tasks not completed yet
   * - implemented with reduce
   */
  timeNeeded() {
    return this.todos
      .filter((t) => !t.completed)
      .reduce((sum, t) => sum + Number(t.time || 0), 0);
  }

  /**
   * editTodo(taskName, updates)
   * - updates: object with optional properties: name, category, time
   * - returns true if task found and at least one property updated, else false
   */
  editTodo(taskName, updates = {}) {
    const task = this.todos.find((t) => t.name === taskName);
    if (!task) return false;

    let updated = false;

    if (updates.name && updates.name.toString().trim() !== "" && updates.name !== task.name) {
      task.name = updates.name.toString().trim();
      updated = true;
    }

    if (
      updates.category &&
      updates.category.toString().trim() !== "" &&
      updates.category !== task.category
    ) {
      task.category = updates.category.toString().trim();
      updated = true;
    }

    if (typeof updates.time !== "undefined") {
      const newTime = Number(updates.time);
      if (!Number.isNaN(newTime) && newTime >= 0 && newTime !== task.time) {
        task.time = newTime;
        updated = true;
      }
    }

    return updated;
  }

  /**
   * getTodo(query)
   * - query can be a task name or a category name
   * - returns first matching task or undefined
   */
  getTodo(query) {
    if (!query) return undefined;
    // first try name match
    const byName = this.todos.find((t) => t.name === query);
    if (byName) return byName;
    // then category
    const byCategory = this.todos.find((t) => t.category === query);
    return byCategory;
  }

  /**
   * largestTodo()
   * - among incomplete tasks, return the task with the largest time
   * - if none, returns undefined
   */
  largestTodo() {
    const pending = this.todos.filter((t) => !t.completed);
    if (pending.length === 0) return undefined;
    return pending.reduce((max, t) => (t.time > max.time ? t : max), pending[0]);
  }

  /**
   * smallestTodo()
   * - among incomplete tasks, return task with smallest time
   */
  smallestTodo() {
    const pending = this.todos.filter((t) => !t.completed);
    if (pending.length === 0) return undefined;
    return pending.reduce((min, t) => (t.time < min.time ? t : min), pending[0]);
  }

  /**
   * sortTodos()
   * - reorder this.todos such that incomplete tasks are sorted by time desc (largest to smallest)
   * - completed tasks follow (their relative order preserved)
   */
  sortTodos() {
    const incomplete = this.todos.filter((t) => !t.completed).sort((a, b) => b.time - a.time);
    const complete = this.todos.filter((t) => t.completed);
    this.todos = [...incomplete, ...complete];
    console.log("🔀 Todos sorted: incomplete tasks ordered by time (high → low).");
    return this.todos;
  }

  /**
   * undoTodo(taskName)
   * - if task exists and completed === true, set to false and return true
   * - else return false
   */
  undoTodo(taskName) {
    const task = this.todos.find((t) => t.name === taskName);
    if (!task) return false;
    if (!task.completed) return false;
    task.completed = false;
    return true;
  }

  /**
   * completedPercentage()
   * - returns percent completed (0 - 100)
   */
  completedPercentage() {
    const total = this.todos.length;
    if (total === 0) return "0%";
    const completedCount = this.todos.filter((t) => t.completed).length;
    const percent = (completedCount / total) * 100;
    return `${parseFloat(percent.toFixed(2))}%`;
  }

  /**
   * importTodos(jsonString)
   * - accepts a JSON string representing an array of task-like objects
   * - each object may have: name, time, category, completed (optional)
   * - returns number of tasks successfully imported
   */
  importTodos(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        console.log("❌ JSON must be an array of tasks.");
        return 0;
      }
      let count = 0;
      for (const item of parsed) {
        if (!item || !item.name) continue;
        const name = item.name.toString().trim();
        const time = Number(item.time ?? 0);
        const category = item.category ? item.category.toString().trim() : "Uncategorized";
        const completed = !!item.completed;
        if (name === "" || Number.isNaN(time) || time < 0) continue;

        const newTask = {
          id: this.todos.length + 1,
          name,
          category,
          time,
          completed,
          createdAt: new Date().toISOString(),
        };
        this.todos.push(newTask);
        count++;
      }
      console.log(`📥 Imported ${count} task(s).`);
      return count;
    } catch (err) {
      console.log("❌ Invalid JSON:", err.message);
      return 0;
    }
  }

  /**
   * clearAllTodos()
   * - empties the todos list
   */
  clearAllTodos() {
    const len = this.todos.length;
    this.todos = [];
    console.log(`🧹 Cleared all todos (${len} removed).`);
  }
}

/* -------------------------
   Example usage (you can remove when using in production)
   ------------------------- */

if (typeof window === "undefined" || typeof module !== "undefined") {
  // Node/console testing example
  const app = new TodoApp();

  app.addTodo("পড়াশোনা কর", 3, "Study");
  app.addTodo("বই পড়", 2, "Learning");
  app.addTodo("ফুটবল খেল", 1.5, "Entertainment");
  app.addTodo("ডাক্তারের কাছে যাও", 0.5, "Health");
  app.displayTodoList();

  app.completeTodo("পড়াশোনা কর");
  console.log("Hours worked (completed):", app.hoursWorked());
  console.log("Time needed (pending):", app.timeNeeded());

  // edit
  console.log("Edit result:", app.editTodo("বই পড়", { name: "বই অধ্যয়ন", time: 2.5 }));
  app.displayTodoList();

  // getTodo
  console.log("getTodo by name:", app.getTodo("ফুটবল খেল"));
  console.log("getTodo by category:", app.getTodo("Study"));

  // largest & smallest pending
  console.log("Largest pending:", app.largestTodo());
  console.log("Smallest pending:", app.smallestTodo());

  // sort pending tasks
  app.sortTodos();
  app.displayTodoList();

  // undo completed
  console.log("Undo:", app.undoTodo("পড়াশোনা কর"));
  console.log("Completed percentage:", app.completedPercentage());

  // import example
  const jsonData = JSON.stringify([
    { name: "নতুন কাজ ১", time: 4, category: "Personal" },
    { name: "নতুন কাজ ২", time: 1, category: "Study", completed: true },
  ]);
  app.importTodos(jsonData);
  app.displayTodoList();

  // clear all
  // app.clearAllTodos();
  // app.displayTodoList();
}

// Export for Node if needed
if (typeof module !== "undefined") {
  module.exports = TodoApp;
}
