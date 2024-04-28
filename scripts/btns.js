const btnSchemeOpen = document.querySelector(".make-scheme"),
    btnSaveScheme = document.querySelector(".save-scheme"),
    schemeArea = document.querySelector(".scheme-area");

btnSchemeOpen.addEventListener("click", ()=>{
    schemeArea.style.display = "inline";
});
// Y
let svgs = document.getElementsByClassName("svg");

btnSaveScheme.addEventListener("click", ()=>{
      schemeArea.style.display = "none";
}); 
