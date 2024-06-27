function ResponsiveMenu() {
    const menubtn = document.getElementById("menubtn")
    const menubody = document.getElementById("menubody")
    const menu_btn_close = document.querySelector(".menu_btn_close")
    const menu_btn_open = document.querySelector(".menu_btn_open")


    menubtn.onclick = () => {
        if (menubody.classList.contains("menubody")) {
            menubody.classList.remove("menubody")
            menubody.classList.add("closeMenu")
            menu_btn_close.classList.add("hidden")
            menu_btn_open.classList.remove("hidden")

        } else {
            menubody.classList.add("menubody")
            menubody.classList.remove("closeMenu")
            menu_btn_open.classList.add("hidden")
            menu_btn_close.classList.remove("hidden")
        }
    }
}
// Responsive menu
ResponsiveMenu(); 

const tabBtn = document.querySelectorAll('[class*="tab-btn"]')
const tabs  = document.querySelectorAll('[class*="tab-item"]')


function hideTabs(index = 0 ){
    let _index = []
    tabs.forEach(tab => {
        tab.style.display = 'none'
        _index.push(tab.className)
    });
    console.log(_index);
    if(index == 0){
        tabs[index].style.display= "block"
    }else{
        for(let i = 0; i <= _index.length; i++){
            if(_index[i].includes(index)){
                console.log(i);
                tabs[i].style.display= "block"
                return
            }
        }
    }
}
hideTabs(); 

tabBtn.forEach(btn=>{
    btn.onclick = (e)=>{
        const selectedBtnClasses = e.target.classList
        selectedBtnClasses.forEach(className =>{
            if(className.includes('btn')){
                const tabItem = className.replace('btn', 'item')
                tabs.forEach(tab => {
                    if(tab.classList.contains(tabItem)){
                        hideTabs(tabItem)
                    }
                });
                return
            }
        })
    }
})
