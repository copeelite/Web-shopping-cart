window.onload = (event) => {autoType(),displayPart()}
let zero = 0
let brand = "Carvel"
let loadTime = 400
const jump = document.querySelector('.brand')

function autoType()
{   
    if(zero < brand.length)
    {   
        document.getElementById('brand').innerHTML += brand.charAt(zero)
        zero++
        setTimeout(autoType, loadTime)
    }
    else{
        jump.classList.toggle('brand')
        zero = 0 
    }  
}

let learnMore = document.getElementById('learn_more')
let stars = document.getElementById('star')
stars.style.transform = "rotate(2.5rad)"
learnMore.addEventListener("mouseout", () => {
    stars.style.transform = "rotate(2.5rad)"
});
learnMore.addEventListener("mouseover", () => {
    stars.style.transform = "rotate(0rad)"
});

let getStarted = document.getElementById('get_started')
let icon = document.getElementById('icon_rotate')
getStarted.addEventListener("mouseover", () => {
    icon.style.transform = "rotate(1rad)"
});
getStarted.addEventListener("mouseout", () => {
    icon.style.transform = "rotate(0rad)"
});

let count = 1;
function displayPart(check){
        if(check===1)
        {
            if(count === 4)
            {
                count = 1
            }
            else{
                count++;
            }

        }
        else if(check===0)
        {
            if(count === 1)
            {
                count = 4
            }
            else{
                count--;
            }
        }
    let displayPart = document.querySelector('.display-part')
    displayPart.innerHTML = ""
    let h2 = document.createElement('h2')
    let p = document.createElement('p')
    let img = document.createElement('img')
    img.classList.add('img-fluid')
    switch(count){
        case 1:
            h2.innerHTML += "Step 1"
            p.innerHTML += "SIZE/SHAPE"
            img.src = "https://www.carvel.com/cakes/-/media/Carvel/Menu/Cakes/Customize/step1.png"
            break
        case 2:
            h2.innerHTML += "Step 2"
            p.innerHTML += "ICE CREAM"
            img.src = "https://www.carvel.com/cakes/-/media/Carvel/Menu/Cakes/Customize/step2.png"
            break
        case 3:
            h2.innerHTML += "Step 3"
            p.innerHTML += "TOPPINGS"
            img.src = "https://www.carvel.com/cakes/-/media/Carvel/Menu/Cakes/Customize/step3.png"
            break
        case 4:
            h2.innerHTML += "Step 4"
            p.innerHTML += "EDIBLE IMAGE"
            img.src = "https://www.carvel.com/cakes/-/media/Carvel/Menu/Cakes/Customize/step4.png"
            break
        default:
            alert("somethings wrong, try again")
    }
    img.height = "150"
    img.width = "250"
    displayPart.append(h2, p, img)
}