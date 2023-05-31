module.exports = x=>{
  let string = "";
  for (i = 0; i < x - 1; i++) {string += "?, ";}
  string += "?";
  return string;
}