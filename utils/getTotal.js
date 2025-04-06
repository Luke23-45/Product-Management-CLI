

export const getCartTotal = async (data) => {
  console.log(data)
  if(data.length == 0){
    return 0;
  }
  let total = 0;
  for(let i = 0; i < data.length; i++){
    total += data[i].price
  }
  return total;
};