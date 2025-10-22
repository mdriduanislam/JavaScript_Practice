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