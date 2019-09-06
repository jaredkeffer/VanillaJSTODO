let DATA = [];
let dataPrinter = document.getElementById('dataPrinter');
Glow(dataPrinter);
let allPages = [];

InitializeData();
allPages = GetTotalPages();
console.log(allPages);

dataPrinter.addEventListener('click', function(){
    Save();
});

pageContainer = document.getElementById('pageContainer');
pageButton = document.getElementById('newPage');
pageButton.addEventListener('click', createPage);
Glow(pageButton);

let menuOpen = false;
let mainMenu = document.getElementById('mainMenu');
let settingsGear = document.getElementById('settingsGear');
settingsGear.draggable = false;
settingsGear.addEventListener('click', function(){
    if (menuOpen === false) {
        menuOpen = true;
        openMenu(mainMenu);
        settingsGear.classList.remove('rotateRight');
        settingsGear.classList.add('rotateLeft');
    } else if (menuOpen === true) {
        menuOpen = false;
        closeMenu(mainMenu);
        settingsGear.classList.remove('rotateLeft');
        settingsGear.classList.add('rotateRight');
    }
});

autoLockScroll();

function createPage() {
    let page = document.createElement('div');
    page.classList.add('page');
    let deleteButton = createDeleteButton(page);
    deleteButton.classList.add('pageButton');

    let newCardButton = document.createElement('div');
    newCardButton.classList.add('button');
    newCardButton.classList.add('pageButton');
    Glow(newCardButton);

    let newCardText = document.createTextNode('+');
    newCardButton.appendChild(newCardText);

    page.appendChild(newCardButton);
    
    pageContainer.appendChild(page);
    newCardButton.addEventListener('click', function() {
        let newCard = createCard(page);
        createItem(newCard, '');
    });
    newCardButton.addEventListener('mousedown', function(){
        newCardButton.classList.add('.buttonActive');
    });
    GetTotalPages();
    return page;
}

function createCard(_page) {
    let card = document.createElement('div');
    card.classList.add('card');

    let newItemButton = document.createElement('div');
    newItemButton.classList.add('button');
    newItemButton.classList.add('cardButton');
    Glow(newItemButton);
    
    let newItemText = document.createTextNode('+');
    newItemButton.appendChild(newItemText);
    card.appendChild(newItemButton);
    _page.appendChild(card);
    
    newItemButton.addEventListener('click', function() {
        createItem(card, '');
    });
    let deleteButton = createDeleteButton(card);
    deleteButton.classList.add('cardDeleteButton');
    return card;
}

function createItem(_card, _text) {
    let itemText = _text;

    let item = document.createElement('div');
    item.classList.add('item');

    let itemInput = document.createElement('div');
    itemInput.classList.add('input');
    itemInput.innerText = itemText;
    item.appendChild(itemInput);
    _card.appendChild(item);

    itemInput.setAttribute('contentEditable', 'true');
    itemInput.setAttribute('onChange', 'changeItemText');

    itemInput.addEventListener('input', function() {
        itemText = itemInput.innerText;
    });    
    let deleteButton = createDeleteButton(item);
    deleteButton.classList.add('itemButton');
    itemInput.focus();
}

function createDeleteButton(_parent) {
    let deleteButton = document.createElement('div');
    deleteButton.classList.add('deleteButton');
    deleteButton.classList.add('button');

    let deleteButtonText = document.createTextNode('-');
    deleteButton.appendChild(deleteButtonText);

    _parent.appendChild(deleteButton);

    deleteButton.addEventListener('click', function(){
        _parent.remove();
    });
    Glow(deleteButton);
    return deleteButton;
}

function Save() {
    DATA = [];
    let PAGES = [];
    let pages = Array.from(document.getElementsByClassName('page'));
    pages.forEach(function(page) {
        let cards = Array.from(page.getElementsByClassName('card'));
        let CARDS = [];
        cards.forEach(function(card){
            let items = Array.from(card.getElementsByClassName('item'));
            let ITEMS = [];
            items.forEach(function(item){
                let itemContent = {text: item.childNodes[0].innerText};
                ITEMS.push(itemContent);
            });
            CARDS.push(ITEMS);
        });
        PAGES.push(CARDS);
    });
    DATA.push(PAGES);
    window.localStorage.setItem('DATA', JSON.stringify(DATA));
    console.log("Data Saved!");
}

function InitializeData() {
    let _DATA = JSON.parse(window.localStorage.getItem('DATA'));
    for (i = 0; i < _DATA[0].length; i++) {
        let _page = createPage();
        for (j = 0; j < _DATA[0][i].length; j++) {
            let _card = createCard(_page);
            for (k = 0; k < _DATA[0][i][j].length; k++) {
                let _text = _DATA[0][i][j][k].text;
                createItem(_card, _text);
            }
        }
    } 
}

function GetTotalPages() {
    let _totalPages = Array.from(document.getElementsByClassName('page'));
    return _totalPages;
}

function Glow(element) {
    element.addEventListener('mousedown', function(){
        element.classList.add('buttonActive');
    });
    element.addEventListener('mouseup', function(){
        element.classList.remove('buttonActive');
    });
    element.addEventListener('mouseleave', function(){
        element.classList.remove('buttonActive');
    });
}

function openMenu(menu) {
    menu.classList.remove('closeMenu');
    menu.classList.remove('closeMenuInitial');
    menu.classList.add('openMenu');
}

function closeMenu(menu) {
    menu.classList.remove('openMenu');
    menu.classList.add('closeMenu');
}
function autoLockScroll() {
    let isScrolling;
    window.addEventListener('scroll', function ( event ) {
        window.clearTimeout( isScrolling );
        isScrolling = setTimeout(function() {
            scrollMagnet();
        }, 400);
    }, false);
}
function scrollMagnet() {
    let _pages = GetTotalPages();
    let _scrollPos = window.scrollY;
    let _closestPageIndex = 0;
    let _minDist = 100000;
    for (i = 0; i < _pages.length; i++) {
        let _currentPagePos = Math.abs(_pages[i].getBoundingClientRect().top);
        if (_currentPagePos < _minDist) {
            _minDist = _currentPagePos;
            _closestPageIndex = i;
        }
    }
    window.scrollTo(0, _pages[_closestPageIndex].offsetTop);
}