// fetching all value using custim attributes,calss or in as provided.

const inputslider = document.querySelector("[data-lengthSlider]"); // custom attributes
const datadisplay = document.querySelector("[data-length]");

const passworddisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copyButton]");
const copymsg = document.querySelector("[data-copyMsg]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generatepass");
// containing all checkbox
const allcheckbox = document.querySelectorAll("input[type=checkbox]");

// string of symbols.
const symbolss = '`~!@#$%^&*()_-+=|*:;"<>?/[{}].';

// main code
let password = "";
let passwordlength = 10;
let checkcount = 0;
// set (strenght) circle color to grey.initially.

// writing method/ function
handleslider();
setindicator("#ccc");
// its work
function handleslider(){
    inputslider.value = passwordlength;
    datadisplay.innerText = passwordlength; 
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize = ( (passwordlength - min)*100/(max - min)) + "% 100%"
}
// indicator function
function setindicator(color){
    indicator.style.backgroundColor  = color;
    // box shadow pending
   indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
setindicator();
// get random int function
function getrandomint(min,max){
    return Math.floor(Math.random() * (max-min)) + min; 
}
// function for uppercase
function getrandomnumbers(){
    return getrandomint(0,9);
}

// function to generate lowercase
function getrandomlowercase(){
    return String.fromCharCode(getrandomint(97,123));
}
// fucntion to fetch uppercase
function getrandomuppercase(){
    return String.fromCharCode(getrandomint(65,91));
}

//function to symbols
function randomsymbols(){
    const randomind =  getrandomint(0,symbolss.length);
    return symbolss.charAt(randomind);
}

// fucntion to generate strength
function calcstrength(){

    let hasupper = false;
    let haslower = false;
    let hassymbols = false;
    let hasnumbers = false;
    if(uppercase.checked) hasupper = true;
    if(lowercase.checked) haslower = true;
    if(symbols.checked) hassymbols = true;
    if(numbers.checked)  hasnumbers = true;

    if(hasupper && haslower && (hassymbols || hasnumbers) && passwordlength >= 8){
        setindicator("#0f0");
    }
    else if((hasupper || haslower) && (hassymbols || hasnumbers) && passwordlength >= 6){
        setindicator("#ff0");
    }
    else setindicator("#f00");
}
// fucntion for copied content
async function copycontent(){
    // used to copy message for clipboard.
    try{
       await  navigator.clipboard.writeText (passworddisplay.value);
     // this above function always return a promise..
       copymsg.innerText = "copied";
    }
    catch(e){
       copymsg.innerText = "failed";
    }
    copymsg.classList.add("active"); // become visisble scale become 1 or display hidden to visible

    // to remove after 2 sec
    setTimeout(() => {
        copymsg.classList.remove("active");
        
    },2000);
}
// event listener
inputslider.addEventListener('input',(e) => {
    passwordlength = e.target.value;
    handleslider(); // show change in UI
})
// for copy button
copybtn.addEventListener('click',()=>{
    if(passworddisplay.value){ // no value is present
    copycontent();
    }
})
// shufflepassword fucntion
function shufflepassword(array){
    // fisher yates method
    for(let i = array.length-1;i > 0;i--){
        // finding j 
       const j = Math.floor(Math.random() * (i+1));
       // swapping i and j
       const temp = array[i];
       array[i] = array[j];
       array[j] = temp;
    }
    let str="";
    array.forEach((el)=> (str+= el));
    return str;
}
// checkbox
function handlecheckboxchange(){  // often count form starting. if(any changes occur.)
    checkcount = 0;
    allcheckbox.forEach((checkbox) => {
        
        if(checkbox.checked){
            checkcount++;
        }
    });
    console.log("hello");
    // special condition
    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleslider(); // for making slider change.
    }
}

// check checkboxes
console.log("hello");
allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handlecheckboxchange);
});
console.log("bye");

// generate button
generatebtn.addEventListener('click' ,()=> {

    // none of the checkbox are selected
    if(checkcount == 0) return;
    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleslider();
    }
    console.log("start");
    // finding start the journey to find new password
    password = ""; // removing old password at first.

    // putting compulsory things as checkbox
    /*if(uppercasecheck.checked){
        password+= getrandomuppercase();
    }
    if(lowercasecheck.checked){
        password+= getrandomlowercase();
    }
    if(numbers.checked){
        password+= getrandomnumbers();
    }
    if(symbols.checked){
        password+= randomsymbols();
    }*/

    // using fucntion array
    let funcArr =[];

    if(uppercase.checked){
        funcArr.push(getrandomuppercase);
    }
    if(lowercase.checked){
        funcArr.push(getrandomlowercase);
    }
    if(numbers.checked){
        funcArr.push(getrandomnumbers);
    }
    if(symbols.checked){
        funcArr.push(randomsymbols);
    }
    // compulsory letters
    for(let i=0;i<funcArr.length;i++){
        password+= funcArr[i]();
    }
    console.log("compulsory addition")
    // remaining password
    for(let i=0;i<passwordlength - funcArr.length;i++){
       let randindex = getrandomint(0,funcArr.length);
       password+=  funcArr[randindex]();
    }

    // shuffle password
    password = shufflepassword(Array.from(password));
    passworddisplay.value = password;

    // strength
    calcstrength();
})



